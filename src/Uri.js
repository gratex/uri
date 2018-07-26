
function _equalsQueryStr(query1, query2) {
    if (!query1 || !query2) {
        return query1 == query2;
    }
    var i,
        q1 = ioQuery.queryToObject(query1),
        q2 = ioQuery.queryToObject(query2);
    // only simple non-hierarchical objects (possibly with arrays) will be here 
    for (i in q1) {
        if (!equals(q1[i], q2[i])) {
            return false;
        }
    }
    for (i in q2) {
        if (!equals(q2[i], q1[i])) {
            return false;
        }
    }
    return true;
}

module.export = {
    _equalsQueryStr
};
