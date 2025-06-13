export default (val, req, res, next) => {
    const rVal = {
        'status': val.status,
        'code': val.code,
        'info': null,
    }
    if (val.r){
        rVal.info = val.r;
    }
    
    res.status(val.code);
    res.json(rVal);
    
    next()
}