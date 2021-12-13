document.querySelector("#listClient").addEventListener('click', cargarDatos);
document.querySelector("#saleClient").addEventListener('click', cargarVentas);

function cargarDatos(){
    console.log('dentro de la funcion');
    fetch('http://localhost:8082/api/db_clientes/')
        .then(res => res.json())
        .then( data => {
            let res = document.querySelector('#trdata');
            res.innerHTML = '';

            for (let item of data){
                res.innerHTML += `
                <tr>
                <td>${item.cedulaCliente}</td>
                <td>${item.nombreCliente}</td>
                <td>${item.emailCliente}</td>
                <td>${item.direccionCliente}</td>
                <td>${item.telefonoCliente}</td>
                </tr>
                `
            }
            //console.log(data);
        }).catch((error) =>{
                console.error(error);
        })
}

function cargarVentas(){

    var suma=0;
    var sumaCed = 0;
    fetch('http://localhost:8083/api/db_ventas')
    .then(res => res.json())
    .then( data => {

        let datos = document.querySelector('#data');
        datos.innerHTML = '';

        let res = document.querySelector('#suma');
        res.innerHTML = '0';

        var groupBy = function(datos, prop){
            return datos.reduce(function(groups, item){
                var val = item[prop];
                groups[val] = groups[val] || {cedulaCliente: item.cedulaCliente, nombreCliente: item.nombreCliente, precioVentaTotal: 0};
                groups[val].precioVentaTotal += item.precioVentaTotal;
                return groups;
            },{});
        }
        
        var resultData = Object.values(groupBy(data,'cedulaCliente'));
        
        for (let item of resultData){
            datos.innerHTML += `
            <tr>
            <td>${item.cedulaCliente}</td>
            <td>${item.nombreCliente}</td>
            <td>${item.precioVentaTotal}</td>
            </tr>
            `
        }

        data.forEach(function(elemento, indice){
            suma += elemento["precioVentaTotal"];
        });
        res.innerHTML = suma;

        var cedulas=[];
        data.forEach(function(agrupar){
            if(cedulas.indexOf(agrupar.cedulaCliente)==-1){
                cedulas.push(agrupar.cedulaCliente);
            }
        });

        }).catch((error) =>{
            console.error(error);
    })
}