/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.onReady(function(){

    /**
     * Contenido del panel Central
     */
    var barraHerramientas = {
        id: 'content-panel',
        region: 'north', // this is what makes this panel into a region
        // within the containing layout
        layout: 'card',
        margins: '0 0 0 0',
        activeItem: 0,
        border: false,
        tbar: [{
            xtype: 'tbbutton',
            cls: 'x-btn-text-icon',
            icon: 'img/buscar.png',
            text: 'Parada mas Cercana',
            handler: function(){
                capturarPuntoReferencia();
            }
        },'-',{
            xtype: 'tbbutton',
            cls: 'x-btn-text-icon',
            icon: 'img/buscar1.png',
            text: 'Buscar ruta',
            handler: function(){
                ventanaBuscarRutas();
            }
        },'-',{
            xtype: 'tbbutton',
            cls: 'x-btn-text-icon',
            icon: 'img/buscar2.png',
            text: 'Paradas por hora y sector',
            handler: function(){
                ventanaLocalizarParadaHora();
            }
        },'-',{
            xtype: 'tbbutton',
            cls: 'x-btn-text-icon',
            icon: 'img/limpiar.png',
            text: 'Limpiar Mapa',
            handler: function(){
                limpiarCapas();
            }
        },'-',{
            xtype: 'tbbutton',
            cls: 'x-btn-text-icon',
            icon: 'img/pantalla.png',
            text: 'Pantalla Completa',
            handler: function(){
                window.open ("http://www.utpl.edu.ec/irbu/","IRBU");
            }
        },'-',{
            xtype: 'tbbutton',
            cls: 'x-btn-text-icon',
            icon: 'img/ayuda.png',
            text: 'Ayuda',
            handler: function(){
                window.open ("img/ayuda.pdf","Ayuda KRADAC...");
            }
        }]

    };

    var viewport = new Ext.Viewport({
        layout: 'border',
        items: [
        barraHerramientas
        ,{
            region: 'center',
            contentEl: 'map',
            split: false,
            height: 100,
            minSize: 100,
            maxSize: 200,
            collapsible: false,
            margins: '0 0 0 0'
        }
        ]
    });
});
