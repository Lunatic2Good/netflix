const { stripe } = require("../utils/Stripe");
const router = require("express").Router();
const checkAuth = require("../middleware");

router.get("/products", async (req, res) => {
    const response = await stripe.products.list({
        expand: ["data.default_price"],
    });

    const products = response.data.map(({id, name, default_price}) => {
        return {
            id,
            name,
            canDownload: true,
            canWatchSouthPark: name === "Premium Plan" ? true : false,
            price: {
                id: default_price.id,
                amount: default_price.unit_amount,
            },
        };
    });

    return res.json(products);
});

router.post("/session", async (req, res) => { //creating new session for every payment request
    const { priceId, email } = req.body;
    
    const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        success_url: "http://localhost:5173/browse",
        cancel_url: "http://localhost:5173/plans",
        customer_email: email,
    });
    
    return res.json(session);
});

router.get("/subscription", checkAuth, async (req, res) => { //to give what subscription user have
    // return res.json(req.user);
    const response = await stripe.customers.search({
        query: `email:\'${req.user.email}\'`,
    });

    if(response.data[0]) {
        const customer = response.data[0];

        const subscriptions = await stripe.subscriptions.list({ //as it need customer id to retrieve subscription, we find customer id above
            customer: customer.id,
            expand: ["data.plan.product"],
        });

        if(subscriptions.data[0]) {
            return res.json(subscriptions.data[0].plan.product);
        } else {
            return res.json(null);
        }
    } else {
        return res.json(null);
    }
});

module.exports = router;