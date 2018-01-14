/*================================================
 *== Script puzzle por: Alberto "Olbor" García. ==
 *================================================
 *
 * Para inicializarlo: se debe incluir el framework Mootools y el fichero "puzzle.js" y crear un objeto Mootools de la clase Juego
 * pasándole como parámetro una cadena con el nombre del div en el que se creará todo el contenido.
 *
 * Por ejemplo:
 * window.addEvent("domready", function() { juego = new Juego("miDiv"); });
 *
 * Finalizado el 23/08/2011.
 * 
 */

var Juego = new Class({
    contenedor: null,
    juego: null,
    tablero: null,
    listaPiezas: [],
    guia: null,
    panelAcciones: null,
    btnDesordenar: null,
    btnReordenar: null,
    btnMostrarGuia: null,
    movimientos: null,
    nMovimientos: 0,
    win: null,

    initialize: function(contenedor) {
        this.contenedor = $(contenedor);

        // creo las capas juego, tablero, guía y acciones
        this.juego = new Element("div#juego", {
            styles: {
                "margin":"10px auto",
                "width":"504px",
                "height":"540px",
                "padding":"0",
                "position":"relative"
            }
        });
        this.juego.inject(this.contenedor);

        this.tablero = new Element("div#tablero", {
            styles: {
                "margin-bottom":"5px",
                "width":"500px",
                "height":"500px",
                "padding":"0",
                "border":"2px solid darkgreen",
                "position":"relative"
            }
        });
        this.tablero.inject(this.juego);

        this.guia = new Element("div#guia", {
            styles: {
                "z-index":"2",
                "height":"500px",
                "width":"500px",
                "position":"absolute",
                "background":"white url(\"zelda.jpg\") scroll no-repeat 0 0"
            }
        });
        this.guia.fade("hide");
        this.guia.inject(this.tablero);

        this.panelAcciones = new Element("div#acciones");
        this.panelAcciones.inject(this.juego);

        // botón desordenar
        this.btnDesordenar = new Element("input#desordenar", {
            type:"button",
            value:"Desordenar puzzle",
            styles: {
                "border":"1px solid darkgreen",
                "background-color":"lightgreen",
                "margin-left":"2px"
            }
        });
        this.btnDesordenar.addEvents({
            click: function() {
                this.desordenar();
            }.bind(this),
            mouseover: function() {
                this.setStyles({
                    "background-color":"greenyellow",
                    "cursor":"pointer"
                })
            },
            mouseout: function() {
                this.setStyles({
                    "background-color":"lightgreen",
                    "cursor":"none"
                })
            }
        });
        this.btnDesordenar.inject(this.panelAcciones);

        // botón reordenar
        this.btnReordenar = new Element("input#reordenar", {
            "type":"button",
            "value":"Reodenar puzzle",
            styles: {
                "border":"1px solid darkgreen",
                "background-color":"lightgreen",
                "margin-left":"2px"
            }
        });
        this.btnReordenar.addEvents({
            click: function() {
                this.reordenar();
            }.bind(this),
            mouseover: function() {
                this.setStyles({
                    "background-color":"greenyellow",
                    "cursor":"pointer"
                })
            },
            mouseout: function() {
                this.setStyles({
                    "background-color":"lightgreen",
                    "cursor":"none"
                })
            }
        });
        this.btnReordenar.inject(this.panelAcciones);

        // creo el boton mostrar guia
        this.btnMostrarGuia = new Element("input", {
            "type":"button",
            "value":"Mostrar guía",
            styles: {
                "border":"1px solid darkgreen",
                "background-color":"lightgreen",
                "margin-left":"2px"
            }
        });
        this.btnMostrarGuia.addEvents({
            mouseover: function() {
                this.mostrarGuia();
                this.btnMostrarGuia.setStyles({
                    "background-color":"greenyellow",
                    "cursor":"pointer"
                })
            }.bind(this),
            mouseout: function() {
                this.ocultarGuia();
                this.btnMostrarGuia.setStyles({
                    "background-color":"lightgreen",
                    "cursor":"none"
                })
            }.bind(this)
        });
        this.btnMostrarGuia.inject(this.panelAcciones);

        // creo el contador de movimientos
        this.movimientos = new Element("div#movimientos", {
            "html":"Movimientos: "+this.nMovimientos,
            styles: {
                "float":"right"
            }
        });
        this.movimientos.inject(this.panelAcciones);
        
        // capa win
        this.win = new Element("div#win", {
            "html":"¡Completado!",
            styles: {
                "text-align":"center",
                "font-size":0,
                "padding":0,
                "margin-top":20
            }
        });
        this.win.setOpacity(0);
        this.win.inject(this.juego);

        // creo las fichas, tanto las capas html como los objetos mootools
        for(var i=0; i<16; i++) {
            var nuevoDiv = new Element("div#"+i, {
                styles: {
                    "height":"125px",
                    "width":"125px",
                    "position":"absolute",
                    "background":"white url(\"zelda.jpg\") scroll no-repeat 0 0",
                    "cursor":"pointer"
                }
            });
            this.tablero.grab(nuevoDiv);

            var pieza = new Pieza(i.toString(), this);
            this.listaPiezas.include(pieza);
        }
    },

    desordenar: function() {
        this.actualizaMovimientos(0);
        this.win.setOpacity(0);
        this.win.setStyle("font-size","0px");

        var funcionDesordenar = function() {
            this.listaPiezas.filter(function(elem) {
                return elem.oculta;
            }).each(function(elem) {
                elem.mostrar();
            });

            var arrayN = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

            for(var i=15; i>=0; i--) {
                var rnd = arrayN[Number.random(0,i)];
                this.listaPiezas[i].setPosicion(rnd);

                for(var j=arrayN.indexOf(rnd); j<i; j++)
                    arrayN[j] = arrayN[j+1];
            }

            var piezasABorrar = [0,3,12,15];
            var nRandom = piezasABorrar[Number.random(0,3)];

            this.listaPiezas.filter(function(elem) {
                return elem.idPieza == nRandom;
            }).each(function(elem) {
                elem.ocultar();
            });
        }.bind(this);

        var idPeriodical = funcionDesordenar.periodical(100);
        var pararPeriodical = function() {
            clearInterval(idPeriodical);
        };
        pararPeriodical.delay(1200);
    },

    reordenar: function() {
        this.actualizaMovimientos(0);
        this.win.setOpacity(0);
        this.win.setStyle("font-size","0px");

        this.listaPiezas.each(function(elem) {
            elem.setPosicion(elem.idPieza);
            elem.mostrar();
        });
    },

    actualizaMovimientos: function(n) {
        if(n == 1) {
            this.nMovimientos++;
            this.compruebaFin();
        }
        else if(n == 0) this.nMovimientos = 0;

        this.movimientos.set("html", "Movimientos: "+this.nMovimientos);
    },

    compruebaFin: function() {
        var xy = [];
        var ok = true;

        this.listaPiezas.each(function(pieza) {
            xy = pieza.getPosicionXY();
            if(pieza.posicionX != xy[0] || pieza.posicionY != xy[1])
                ok = false;
        });

        if(ok) { // si ha completado el puzzle
            var pOculta = this.listaPiezas.filter(function(elem) {
                return elem.oculta;
            });
            pOculta[0].pieza.setOpacity(0);
            pOculta[0].mostrar();
            pOculta[0].pieza.fade("in");
            this.win.setOpacity(1);
            this.win.tween("font-size","48px");
        }
    },

    mostrarGuia: function() {
        this.guia.fade(0.7);
    },

    ocultarGuia: function() {
        this.guia.fade("out");
    }
});

var Pieza = new Class({
    pieza: null,
    idPieza: null,
    posicionX: null,
    posicionY: null,
    objJuego: null,
    oculta: false,

    initialize: function(pieza, juego) {
        this.objJuego = juego;
        this.pieza = $(pieza);
        this.idPieza = this.pieza.get("id");

        // evento click para mover las piezas
        this.pieza.addEvent("click", function(e) {
            if(e.control && e.alt) {
                this.objJuego.listaPiezas.each(function(elem) {
                    var xy = elem.getPosicionXY();
                    elem.setPosicionXY(xy[0], xy[1], 0);
                });
                this.objJuego.compruebaFin();
            } else {
                var arrayPosibles = this.objJuego.listaPiezas.filter(function(piezaComparada) {
                    return (((this.posicionX-piezaComparada.posicionX).abs() == 125 && this.posicionY == piezaComparada.posicionY)
                        || ((this.posicionY-piezaComparada.posicionY).abs() == 125 && this.posicionX == piezaComparada.posicionX))
                        && piezaComparada.oculta;
                }.bind(this));
                var piezaVacia = arrayPosibles[0];

                if(piezaVacia != null) {
                    var auxX = this.posicionX;
                    var auxY = this.posicionY;

                    this.setPosicionXY(piezaVacia.posicionX, piezaVacia.posicionY, true);
                    piezaVacia.setPosicionXY(auxX, auxY, false);

                    this.objJuego.actualizaMovimientos(1);
                }
            }
        }.bind(this));

        // posición de la pieza en el tablero y del fondo
        this.setPosicion(this.idPieza);
        this.pieza.setStyle("background-position",-this.posicionX+"px "+-this.posicionY+"px");
    },

    ocultar: function() {
        this.oculta = true;
        this.pieza.setStyles({
            height:0,
            width:0
        });
    },

    mostrar: function() {
        this.oculta = false;
        this.pieza.setStyles({
            height:125,
            width:125
        });
    },

    setPosicion: function(n) { // calcula la posición de las piezas en base al número de pieza
        var fila = (n/4).toInt();
        this.posicionX = n*125-fila*500;
        this.posicionY = fila*125;

        this.pieza.setStyle("left", this.posicionX);
        this.pieza.setStyle("top", this.posicionY);
    },

    setPosicionXY: function(x, y, efecto) { // coloca la pieza en una posición dada por coordenadas
        if(efecto) {
            if(this.posicionX != x)
                this.pieza.tween("left", x+"px");
            else
                this.pieza.tween("top", y+"px");
        } else {
            this.pieza.setStyle("left", x+"px");
            this.pieza.setStyle("top", y+"px");
        }

        this.posicionX = x;
        this.posicionY = y;
    },

    getPosicionXY: function() { // devuelve la posición en la que DEBERÍA estar la pieza según su ID, NO la posición donde está actualmente (usado para calcular el fin del juego)
        var xy = [];

        var fila = (this.idPieza/4).toInt();
        xy[0] = this.idPieza*125-fila*500;
        xy[1] = fila*125;

        return xy;
    }
});