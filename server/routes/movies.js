const router = require("express").Router();
const { prisma } = require("../db");
const checkAuth = require("../middleware");
const fetchSubscription = require("../services/fetchSubscription");

// router.get('/movies/list', (req, res) => {
//     // console.log(req.query);
//     const offset = parseInt(req.query.offset);
//     const from = offset;
//     const to = from + 12;
//     const moviesSubset = [...movies].slice(from, to);
//     // console.log(offset);
//     // console.log(moviesSubset);
//     // setTimeout(() => {
//         return res.json({movies: moviesSubset, count: movies.length});
//     // }, 1000);
// });
router.get('/movies/list', checkAuth, async (req, res) => {
    // console.log(req.query);

    const subscription = await fetchSubscription(req.user.email);

    if(!subscription) {
        return res.status(403).json({
            errors: [
                {
                    msg: "Unauthorized; no plan",
                },
            ],
        });
    }

    const offset = parseInt(req.query.offset);
    const count = await prisma.movie.count();
    const movies = await prisma.movie.findMany({
        take: 12,
        skip: offset
    });
    return res.json({ movies, count });
});

// router.get('/movie/:id', (req, res) => {
//     const id = req.params.id;
//     const movie = movies.find((m) => m.id === id);
//     return res.send(movie)
// });
router.get('/movie/:id', checkAuth, async (req, res) => {
    const id = req.params.id;
    // console.log(typeof(id))
    const movie = await prisma.movie.findUnique({
        where: {
            id: parseInt(id),
        }
    });
    return res.send(movie)
});

module.exports = router;