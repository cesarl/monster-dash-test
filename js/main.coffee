        farbg = {
        w: 512,
        h: 512,
        imgW: 512,
        imgH: 512,
        startX: 0,
        startY: 0}

        midbg = {
        w: 800,
        h: 512,
        imgW: 512,
        imgH: 512,
        startX: 0,
        startY: 0}

        barry = {
        x: 8,
        y: 8,
        w: 32,
        h: 32,
        startX: 0,
        startY: 0,
        partW: 8 * 32,
        partH: 8 * 32,
        stretchW: 64,
        stretchH: 64}

        mummy_tile = {
        x: 8,
        y: 8,
        w: 32,
        h: 32,
        startX: 0,
        startY: 0,
        partW: 8 * 32,
        partH: 8 * 32,
        stretchW: 64,
        stretchH: 64}

        shotgun_tile = {
        x: 8,
        y: 1,
        w: 64,
        h: 32,
        startX: 0,
        startY: 0,
        partW: 8 * 64,
        partH: 1 * 32}


        app = new App()
        app.startCycle(true)
        app.fullScreenOn()
        app.canvas = new Canvas app, "canvas", 512, 512
        app.event = new Event()

        game = () ->
                @
        game.start = () ->
                @farBg = new Node()
                @farBg.addSquare 0, 0, 0, 0
                @farBg.addTexture farbg, app.farbg
                @farBg.animateTexture 1, 0, 3, -1
                @farBg.drawTexture null, null, app.canvas

                @midBg = new Node()
                @midBg.addSquare 0, 0, 0, 0
                @midBg.addTexture midbg, app.midbg
                @midBg.animateTexture 1.5, 0, 1, -1
                @midBg.drawTexture null, null, app.canvas

                @h = new Node()
                @h.addSquare 32, 32, -100, -110
                @h.addTile barry, app.barry
                @h.animateTile 0, 7, false, 4, -1
                @h.slideTo 100, 300, 20
                @h.drawTile null, null, app.canvas
                @h._shoot = pubsub.subscribe("mousedown", =>
                        if @shoot then @shoot.kill()
                        @shoot = new Node()
                        @shoot.addSquare 64, 32, 0, 0
                        @shoot.addTile shotgun_tile, app.shotgun
                        @shoot.drawTile null, null, app.canvas
                        @shoot.follow @h, 2, 60, 30
                        @shoot.animateTile 0, 7, false, 2, 1, (=> @shoot.kill())
                )
                @h._jumpYGravity = 1
                @h._jump = pubsub.subscribe("up", =>
                        @h.animateTile(40, 47, false, 4, 1, (=> @h.animateTile(48, 55, false, 4, 1)))
                        @h.jumpY(-20, @h._jumpYGravity, =>
                                @h.animateTile 0, 6, false, 4, -1
                        )
                )
        game.play = () ->
                @enemies = new Collection()
                @enemies._spawn = @enemies.addCycle 60, -1, =>
                        node = new Node()
                        node.addSquare 32, 32, 300, 300 #250 + Math.floor(Math.random() * 250)
                        node.addTile mummy_tile, app.mummy
                        node.animateTile 0, 7, false, 4, -1
                        node.drawTile null, null, app.canvas
                        @enemies.add(node)
                @enemies._move = @enemies.addCycle 1, -1, =>
                        @enemies.each (elem) =>
                                elem.move -2, 0
                                if elem.square.xx <= 0
                                        elem.killTile()
                        if @h then @enemies.squareCollision(@h.square, (elem) =>
                                elem.killTile()
                        )
                        if @shoot then @enemies.squareCollision(@shoot.square, (elem) =>
                                elem.killTile()
                        )

        scenario = [{
                exec: => game.start(),
                print: true,
                sleep: 250,
                tmpSleep: 25,
                txt: "Are you ready baby",
                x: 250,
                y: 450,
                bgColor: "#fff",
                txtColor: "#000",
                fontFamily: "Arial",
                fontSize: "30"
                },
                {
                exec: => game.play(),
                }
        ]

        app.loadImages [{name: "barry", src: "img/barryfull.png"},
                {name: "shotgun", src: "img/shotgun.png"},
                {name: "midbg", src: "img/egyptmidbg_01.png"},
                {name: "farbg", src: "img/egyptfarbg.png"},
                {name: "egyptwall1", src: "img/egyptwall.png"},
                {name: "egyptwall2", src: "img/egyptwall2.png"},
                {name: "mummy", src: "img/mummyfull.png"}], =>
                        reader = new Reader scenario, app.canvas
                        reader.read()