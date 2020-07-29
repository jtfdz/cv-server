const qformat = {
	select: 'SELECT * FROM usuario_tabla WHERE'
}

const config = {
    dbUrl: 'postgres://spcocaurofywbf:d5c784332236bb43151fad6dd006f908e6a1f42c4df7f2595c8b70a0e13563c4@ec2-35-175-155-248.compute-1.amazonaws.com:5432/d377obaok0uup3',
    port: 5432,
    q1: 'INSERT INTO usuario_tabla(id_usuario, alias_usuario, password, nombre, fecha_registro, correo, tipo_usuario) VALUES (DEFAULT, $1, $2, $3, $4, $5, $6)',
    q2:  qformat.select + ' alias_usuario = $1',
    q3:  qformat.select + ' correo = $1',
    q4:  qformat.select + ' id_usuario = $1',
    q5: 'INSERT INTO nota_tabla (id_nota, id_usuario, tipo_contenido, contenido, fecha, pinned, orden, titulo) VALUES (DEFAULT, $1, $2, $3, $4, false, DEFAULT, $5)',

    q7: 'SELECT tipo_contenido, count(*) from nota_tabla WHERE id_usuario=$1 group by tipo_contenido HAVING count(*) > 0 ORDER BY count(*) LIMIT 1;',
    q8: 'SELECT fecha, count(*) from nota_tabla WHERE id_usuario=$1 AND fecha=current_date group by fecha HAVING count(*) > 0 ORDER BY count(*) LIMIT 1;',
    q9: 'SELECT (SELECT extract(month from fecha)), count(*) from nota_tabla WHERE id_usuario=$1 group by 1 HAVING count(*) > 0;',
    q10: 'DELETE FROM nota_tabla WHERE id_nota= $1 AND id_usuario= $2',
    q11: 'SELECT * FROM nota_tabla WHERE id_nota=$1',
    q12: 'UPDATE nota_tabla SET titulo=$1, contenido=$2 WHERE id_nota=$3 AND id_usuario=$4',
    q13: 'INSERT INTO temporal_code(id_code, id_usuario, codigo) VALUES(DEFAULT, $1, $2)',


    q15: 'SELECT usta.nombre as nombre_usuario, usta.correo, ar.id_articulo, ar.nombre  as nombre_articulo, ar.precio, ar.cantidad, de.nombre as nombre_departamento from articulos as ar, departamento as de, usuario_tabla as usta WHERE de.id_departamento = ar.id_departamento AND usta.id_usuario = ar.id_usuario;',
    q6: 'SELECT * from articulos WHERE id_usuario = $1',
    q14: 'select tipo_usuario from usuario_tabla where id_usuario=$1',
}


module.exports = config;