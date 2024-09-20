const { stripe } = require("../utils/Stripe");

const router = require("express").Router();

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

module.exports = router;