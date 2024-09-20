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

module.exports = router;