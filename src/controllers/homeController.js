
const handleGetHome = async (req, res) => {
    return res.render('homePage.ejs');
}

module.exports = {
    handleGetHome
}