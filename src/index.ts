import E from "express";
let app = E();

app.use(E.static(__dirname + '/../public'));

app.listen(42069, () => {
    console.log("READY");
    
})