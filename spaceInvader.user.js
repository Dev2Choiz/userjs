// ==UserScript==
// @name           SpaceInvader
// @namespace      Dev2Choiz
// @description    SpaceInvader
// @include        http*
// ==/UserScript==


var SpaceInvader = function() {

    this.falldownEnnemiesSpeed = 10;
    this.vaisseauSpeed = 30;
    this.projectileSpeed = 30;
    this.score = 0;
    this.enemyPointValue = 10;
    this.enemyTimeVerticalMove = 10000;
    this.enemyLost = -1;
    this.projectileTimeVerticalMove = 1000;
    this.projectileHeight = 30;
    this.projectileWidth = 10;
    this.spriteExplosion = "http://www.appuntidigitali.it/site/wp-content/uploads/explosion-sprite.png";

    this.init = function() {
        var vaisseau = document.createElement("div");
        vaisseau.id = "vaisseau";

        document.body.appendChild(vaisseau);

        var imageVaisseau = [
            ['https://cdn.pixabay.com/photo/2013/07/12/14/35/space-ship-148536_960_720.png', 0],
            ['http://i.imgur.com/aleX6Rv.png', 180],
            ['http://www.pngmart.com/files/3/Spaceship-PNG-File.png', 0],
            ['https://cdn2.iconfinder.com/data/icons/crystalproject/crystal_project_256x256/apps/kspaceduel.png', 0]
        ];
        numImg        = Math.floor((Math.random() * imageVaisseau.length));
        urlImage      = imageVaisseau[numImg][0];
        rotationImage = imageVaisseau[numImg][1];
        vaisseau.style.backgroundImage = "url('" + urlImage + "')";
        //vaisseau.style.backgroundImage = "url('https://cdn.pixabay.com/photo/2013/07/12/14/35/space-ship-148536_960_720.png')";
        vaisseau.style.backgroundSize = "100% 100%";
        vaisseau.style.width = "100px";
        vaisseau.style.height = "50px";
        vaisseau.style.position = "fixed";
        vaisseau.style.bottom = 0;
        vaisseau.style.zIndex = 100000;

        JQSI('#'+vaisseau.id).css({
            '-webkit-transform' : 'rotate(-' + rotationImage + 'deg)',
            '-moz-transform' : 'rotate(-' + rotationImage + 'deg)',
            '-ms-transform' : 'rotate(-' + rotationImage + 'deg)',
            'transform' : 'rotate(-' + rotationImage + 'deg)'
       });

        this.start();
    };

    this.start = function() {
        var vaisseaur = document.getElementById("vaisseau");
        //this.launchGravity();
        //this.updateDisplayProjectile();

        this.createEnemy();
        this.manageCollision();
        this.purgeEnemy();
        this.purgeProjectile();
        this.setAth();
        this.eventsKey();
    };

    this.setAth = function() {
        JQSI("<div id='spaceInvaderScore'>Score : <span></span></div>").appendTo("body");
        JQSI("#spaceInvaderScore").css({
            "position" : "fixed",
            "top": "5px",
            "left": "5px"
        });
    };


    this.moveVaisseau = function(move) {
        var vaisseau = document.getElementById("vaisseau");
        if("" == vaisseau.style.left) {
            vaisseau.style.left = 0;
        }
        var posX = parseInt(move) + parseInt(vaisseau.style.left);
        if (0 > posX) {
            posX = 0;
        } else if (posX > (window.innerWidth - 100)) {
            posX = window.innerWidth - 100;
        }

        posX = posX + "px";
        vaisseau.style.left = posX;
    };

    this.eventsKey = function() {
        var thisBis = this;
        JQSI("body").keydown(function(event) {

            if (event.which === 37) {  //left
                thisBis.moveVaisseau(-thisBis.vaisseauSpeed);
            } else if (event.which === 39) {  //right
                thisBis.moveVaisseau(thisBis.vaisseauSpeed);
            } else if (event.which === 32 ) {  //space
                thisBis.shot();
            }
        });
    };


    this.createEnemy = function() {
        var thisBis = this;
        var enemy = document.createElement("div");
        enemy.className = "enemy gravity";
        vaisseau.id = "vaisseau";
        enemy.innerHTML = "";
        enemy.style.width = "40px";
        enemy.style.height = "40px";
        enemy.style.position = "fixed";
        enemy.style.top = "0px";
        var imageEnemies = [
            'https://cdn0.iconfinder.com/data/icons/toys/128/teddy_bear_toy_1.png',
            'https://cdn0.iconfinder.com/data/icons/toys/128/teddy_bear_toy_2.png',
            'https://cdn0.iconfinder.com/data/icons/toys/128/teddy_bear_toy_3.png',
            'https://cdn0.iconfinder.com/data/icons/toys/128/teddy_bear_toy_4.png',
            'https://cdn0.iconfinder.com/data/icons/toys/128/teddy_bear_toy_5.png',
            'https://cdn0.iconfinder.com/data/icons/toys/128/teddy_bear_toy_6.png'
        ];
        numImg = Math.floor((Math.random() * imageEnemies.length));
        enemy.style.backgroundImage = "url('" + imageEnemies[numImg] + "')";
        enemy.style.backgroundSize = "100% 100%";
        enemy.style.zIndex = 100000;
        var left = 0;
        left = getRandomInt(0, window.innerWidth-parseInt(enemy.style.width));
        left += "px";
        enemy.style.left = left;

        JQSI(JQSI(enemy)[0]).animate({
            top: window.innerHeight
        }, thisBis.enemyTimeVerticalMove);

        document.body.appendChild(enemy);

        setTimeout(function() {
            thisBis.createEnemy();
        }, 1000);
    };

    this.shot = function() {
        var thisBis = this;
        var left = JQSI("#vaisseau").css("left");
        left = parseInt(left);
        this.createProjectile(left);
    };

    this.createProjectile = function(left) {
        var thisBis = this;

        var projectile = document.createElement("div");
        projectile.className = "projectile";
        projectile.innerHTML = "";
        projectile.style.backgroundColor = "#FF8C00";
        projectile.style.width = this.projectileWidth + "px";
        projectile.style.height = this.projectileHeight + "px";
        projectile.style.position = "fixed";
        projectile.style.top = (window.innerHeight - 40) + "px";
        projectile.style.zIndex = 100000;
        left += parseInt(JQSI("#vaisseau").css("width")) / 2;
        left += "px";
        projectile.style.left = left;

        JQSI(JQSI(projectile)[0]).animate({
            top: "-100px"
        }, thisBis.projectileTimeVerticalMove);

        document.body.appendChild(projectile);
    };

    this.manageCollision = function() {
        var thisBis = this;
        JQSI(".projectile").each(function() {
            var projectileX      = parseInt(JQSI(this).css("left"));
            var projectileY      = parseInt(JQSI(this).css("top"));
            var projectileWidth  = parseInt(JQSI(this).css("width"));
            var projectileHeight = parseInt(JQSI(this).css("height"));
            var thisProjectile = this;

            JQSI(".enemy").each(function() {
                var enemyX      = parseInt(JQSI(this).css("left"));
                var enemyY      = parseInt(JQSI(this).css("top"));
                var enemyWidth  = parseInt(JQSI(this).css("width"));
                var enemyHeight = parseInt(JQSI(this).css("height"));
                // Est ce que le projectile est en collision avec cet ennemie ?
                if(
                    (
                        (
                            projectileX > enemyX
                            && projectileX < (enemyX + enemyWidth)
                        )
                        ||
                        (
                            (projectileX + projectileWidth)  > enemyX
                            && (projectileX + projectileWidth) < (enemyX + enemyWidth)
                        )
                    )
                    &&
                    (
                        (
                            projectileY > enemyY
                            && projectileY < (enemyY + enemyHeight)
                        )
                        ||
                        (
                            (projectileY + projectileHeight)  > enemyY
                            && (projectileY + projectileHeight) < (enemyY + enemyHeight)
                        )
                    )
                ) {
                     //collision
                    var thisEnemyNative = JQSI(this)[0];
                    thisBis.explodeEnemy(thisProjectile, thisEnemyNative);
                }

            });

        });

        setTimeout(function() {
            thisBis.manageCollision();
        }, 50);
    };

    this.explodeEnemy = function(thisProjectile, thisEnemy) {
        var thisBis = this;
        JQSI(thisEnemy).removeClass('enemy');
        JQSI(thisProjectile).remove();
        this.changeScore(thisBis.enemyPointValue);

        var multiplierX, multiplierY = 1;
        var config = {
            "widthSprite" : 94,
            "heightSprite" : 100,
            "numberHorizontalSprites" : 5,
            "numberVerticalSprites" : 3
        };

        this.spriteExplosionAnimation(thisEnemy, this.spriteExplosion, "400%", "300%", config, 1, 1, function() {
            JQSI(thisEnemy).remove();
        });
    };


    this.spriteExplosionAnimation = function(thisEnemy, sprite, multiplierX, multiplierY, config, numberLoop, step, callback) {
        // boom
        var thisBis = this;
        var posX = ((step % config["numberHorizontalSprites"]) - 1) * config["widthSprite"];
        var posY = Math.floor(step / config["numberHorizontalSprites"]) * config["heightSprite"];

        console.log(posX + "px " + posY + "px");


        //JQSI("#spaceInvaderScore span").html(this.score);
        thisEnemy.style.backgroundImage = "url('" + sprite + "')";
        thisEnemy.style.backgroundSize = multiplierX + " " + multiplierY;
        thisEnemy.style.backgroundPosition = posX + "px " + posY + "px";



        if (config["numberHorizontalSprites"] * config["numberVerticalSprites"] === step) {
            //callback

        } else {
            setTimeout(function() {
                thisBis.spriteExplosionAnimation(thisEnemy, sprite, multiplierX, multiplierY, config, numberLoop, step + 1, callback);
            }, 250);
        }
    };


    this.purgeEnemy = function() {
        var thisBis = this;

        JQSI(".enemy").each(function() {
              var top = JQSI(this).css("top");
              top = parseInt(top);
              var height = JQSI(this).css("height");
              height = parseInt(height);
              if ((top + height) >= window.innerHeight) {
                  JQSI(this).remove();
                  thisBis.changeScore(thisBis.enemyLost);
              }
        });
        setTimeout(function() {
            thisBis.purgeEnemy();
        }, 250);
    };

    this.purgeProjectile = function() {
        var thisBis = this;

        JQSI(".projectile").each(function() {
              var top = JQSI(this).css("top");
              top = parseInt(top);
              if (top + thisBis.projectileHeight <=0) {
                  JQSI(this).remove();
              }
        });
        setTimeout(function() {
            thisBis.purgeProjectile();
        }, 250);
    };

    this.changeScore = function(delta) {
        this.score += delta;
        if (0 > this.score) {
            this.score = 0;
        }
        JQSI("#spaceInvaderScore span").html(this.score);
    };
};

function getRandomInt(min, max)
{
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function startSpaceInvader()
{
    // jquery est chargé. On peut initialiser le jeu
    window.JQSI = jQuery.noConflict(true);
    var game = new SpaceInvader();
    game.init();
}

var scriptJquery = document.createElement('script');
scriptJquery.src = '//code.jquery.com/jquery-1.12.0.min.js';
scriptJquery.addEventListener('load', startSpaceInvader, false);
document.body.appendChild(scriptJquery);
