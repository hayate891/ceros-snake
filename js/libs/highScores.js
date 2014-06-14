define([ 'Kinetic', 'kineticEditableText', 'Firebase', 'settings', 'util' ],
    function( Kinetic, kineticEditableText, Firebase, settings, util ){
        var highScores = {},
            _s = settings.highScores;

        highScores.init = function( options ){
            highScores.database = {
                ref: new Firebase( _s.database ),

                highest: highScores.database.ref.limit( _s.limit ).endAt(),

                addScore: function() {
                    highScores.database.ref
                        .child( Math.random().toString( 36 ).slice( 2 ))
                        .setWithPriority({
                            name: highScores.name.field.text(),
                            score: highScores.score,
                            time: new Date().getTime()
                        }, highScores.score );
                }
            };

            highScores.isNotStoppingOrStopped = function() {
                return highScores.add.isNotStoppingOrStopped() ||
                       highScores.view.isNotStoppingOrStopped()
            };

            highScores.cleanUp = function() {
                highScores.background.animation.randomize();

                highScores.submit.shape.fill( _s.submit.fill );
                highScores.back.shape.fill( _s.back.fill );
                highScores.previous.fill( _s.previous.fill );
                highScores.next.fill( _s.next.fill );
            };

            highScores.background = options.background.highScores;

            highScores.scoreLabel = new Kinetic.Text({
                x: util.calculate.absolute.x( _s.scoreLabel.x ),
                y: util.calculate.absolute.y( _s.scoreLabel.y ),
                text: 'Score',
                fontSize: util.calculate.absolute.size( _s.scoreLabel.size ),
                fontFamily: settings.font.face,
                fill: settings.font.colors.fill.enabled.hex,
                stroke: settings.font.colors.stroke.enabled.hex,
                strokeWidth: util.calculate.absolute.size( _s.scoreLabel.stroke.width )
            });

            highScores.name = {
                label: new Kinetic.Text({
                    x: util.calculate.absolute.x( _s.name.label.x ),
                    y: util.calculate.absolute.y( _s.name.label.y ),
                    text: 'Name:',
                    fontSize: util.calculate.absolute.size( _s.name.label.size ),
                    fontFamily: settings.font.face,
                    fill: settings.font.colors.fill.enabled.hex,
                    stroke: settings.font.colors.stroke.enabled.hex,
                    strokeWidth: util.calculate.absolute.size( _s.name.label.stroke.width )
                })
            };

            highScores.back = {
                mouseOver: false,

                shape: new Kinetic.Text({
                    x: util.calculate.absolute.x( _s.back.x ),
                    y: util.calculate.absolute.y( _s.back.y ),
                    text: '\uf057',
                    fontSize: util.calculate.absolute.size( _s.back.size ),
                    fontFamily: settings.font.face,
                    fill: settings.font.colors.fill.enabled.hex,
                    stroke: settings.font.colors.stroke.enabled.hex,
                    strokeWidth: util.calculate.absolute.size( _s.back.stroke.width )
                }),

                hitBox: new Kinetic.Rect({
                    x: util.calculate.absolute.x( 2.518 ),
                    y: util.calculate.absolute.y( 1.23 ),
                    width: util.calculate.absolute.x( 12.39 ),
                    height: util.calculate.absolute.y( 6.92 ),
                    opacity: 0
                })
            };

            ( function _layers() {
                highScores.add.layer = new Kinetic.Layer();
                highScores.view.layer = new Kinetic.Layer();

                highScores.add.layer.add( highScores.background.group );
                highScores.view.layer.add( highScores.background.group );

                highScores.add.layer.add( highScores.scoreLabel );
                highScores.view.layer.add( highScores.scoreLabel );

                highScores.add.layer.add( highScores.name.label );
                highScores.view.layer.add( highScores.name.label );

                highScores.add.layer.add( highScores.back.shape );
                highScores.add.layer.add( highScores.back.hitBox );
                highScores.view.layer.add( highScores.back.shape );
                highScores.view.layer.add( highScores.back.hitBox );
            })();

            highScores.add.init( options );

            highScores.view.init( options )
        };

        highScores.add = {
            state: 'stopped',

            start: function( segments ){
                highScores.score = segments.length;

                highScores.background.count.segments( segments )
            },

            isNotStoppingOrStopped: util.module.isNotStoppingOrStopped,

            cleanUp: highScores.cleanUp,

            init: function( options ){
                kineticEditableText( Kinetic );

                highScores.name.field = new Kinetic.EditableText({
                    x: util.calculate.absolute.x( _s.name.field.x ),
                    y: util.calculate.absolute.y( _s.name.field.y ),
                    fontSize: util.calculate.absolute.size( _s.name.field.size ),
                    fontFamily: settings.font.face,
                    fill: settings.font.colors.fill.enabled.hex,
                    stroke: settings.font.colors.stroke.enabled.hex,
                    strokeWidth: util.calculate.absolute.size( _s.name.field.stroke.width ),
                    focusLayer: highScores.add.layer,
                    stage: options.stage
                });

                highScores.submit = {
                    mouseOver: false,

                    shape: new Kinetic.Text({
                        x: util.calculate.absolute.x( _s.submit.x ),
                        y: util.calculate.absolute.y( _s.submit.y ),
                        text: '\uf058',
                        fontSize: util.calculate.absolute.size( _s.submit.size ),
                        fontFamily: settings.font.face,
                        fill: settings.font.colors.fill.enabled.hex,
                        stroke: settings.font.colors.stroke.enabled.hex,
                        strokeWidth: util.calculate.absolute.size( _s.submit.stroke.width )
                    }),

                    hitBox: new Kinetic.Rect({
                        x: util.calculate.absolute.x( 2.518 ),
                        y: util.calculate.absolute.y( 1.23 ),
                        width: util.calculate.absolute.x( 12.39 ),
                        height: util.calculate.absolute.y( 6.92 ),
                        opacity: 0
                    })
                };

                highScores.add.animation = new Kinetic.Animation( function( frame ){
                    if ( highScores.add.state === 'stopping' ){

                        highScores.add.animation.stop( highScores.add, frame )
                    }
                }, highScores.add.layer );

                ( function _layer() {
                    highScores.add.layer.add( highScores.name.field );

                    highScores.add.layer.add( highScores.submit.shape );
                    highScores.add.layer.add( highScores.submit.hitBox );
                })();
            }
        };

        highScores.view = {
            state: 'stopped',

            isNotStoppingOrStopped: util.module.isNotStoppingOrStopped,

            cleanUp: highScores.cleanUp,

            init: function() {
                highScores.name.scoreHolder = new Kinetic.Text({
                    x: util.calculate.absolute.x( _s.name.scoreHolder.x ),
                    y: util.calculate.absolute.y( _s.name.scoreHolder.y ),
                    text: 'Name:',
                    fontSize: util.calculate.absolute.size( _s.name.scoreHolder.size ),
                    fontFamily: settings.font.face,
                    fill: settings.font.colors.fill.enabled.hex,
                    stroke: settings.font.colors.stroke.enabled.hex,
                    strokeWidth: util.calculate.absolute.size( _s.name.scoreHolder.stroke.width )
                });

                highScores.previous = {
                    mouseOver: false,

                    shape: new Kinetic.Text({
                        x: util.calculate.absolute.x( _s.previous.x ),
                        y: util.calculate.absolute.y( _s.previous.y ),
                        text: '\uf060',
                        fontSize: util.calculate.absolute.size( _s.previous.size ),
                        fontFamily: settings.font.face,
                        fill: settings.font.colors.fill.enabled.hex
                    }),

                    hitBox: new Kinetic.Rect({
                        x: util.calculate.absolute.x( 2.518 ),
                        y: util.calculate.absolute.y( 1.23 ),
                        width: util.calculate.absolute.x( 12.39 ),
                        height: util.calculate.absolute.y( 6.92 ),
                        opacity: 0
                    })
                };

                highScores.next = {
                    mouseOver: false,

                    shape: new Kinetic.Text({
                        x: util.calculate.absolute.x( _s.next.x ),
                        y: util.calculate.absolute.y( _s.next.y ),
                        text: '\uf061',
                        fontSize: util.calculate.absolute.size( _s.next.size ),
                        fontFamily: settings.font.face,
                        fill: settings.font.colors.fill.enabled.hex
                    }),

                    hitBox: new Kinetic.Rect({
                        x: util.calculate.absolute.x( 2.518 ),
                        y: util.calculate.absolute.y( 1.23 ),
                        width: util.calculate.absolute.x( 12.39 ),
                        height: util.calculate.absolute.y( 6.92 ),
                        opacity: 0
                    })
                };

                highScores.index = 0;

                highScores.view.update = function() {
                    highScores.background.count.segments(
                        highScores.database.scores[ highScores.index ].score
                    );

                    highScores.name.scoreHolder.text(
                        highScores.database.scores[ highScores.index ].name
                    )
                };

                highScores.view.animation = new Kinetic.Animation( function( frame ){
                    if ( highScores.view.state === 'starting' ){
                        highScores.view.update();

                        highScores.view.state = 'running'

                    } else if ( highScores.view.state === 'running' ){


                    } else if ( highScores.view.state === 'stopping' ){

                        highScores.view.animation.stop( highScores.view, frame )
                    }
                }, highScores.view.layer );

                ( function _layer() {
                    highScores.view.layer.add( highScores.name.scoreHolder );

                    highScores.view.layer.add( highScores.previous.shape );
                    highScores.view.layer.add( highScores.previous.hitBox );

                    highScores.view.layer.add( highScores.next.shape );
                    highScores.view.layer.add( highScores.next.hitBox );
                })();
            }
        };

        return highScores
    }
);