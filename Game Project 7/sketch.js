/*

GAME PROJECT - FINAL SUBMISSION
BY MARY-BRENDA AKODA


BACKGROUND STORY

Baby Ninja is done with life as a Ninja 
and plans to escape their jungle fortress for less sinister pastures, 
but will her fellow Ninjas accept her decision?


EXPLAINING EXTENSIONS COMPLETED

EXTENSION 1: Add Sound - Background music was added to play and loop during game play.
                         However, due to Google Chrome's Autoplay Policy Restrictions, 
                         on first loading the page, the background music is suspended 
                         and only allowed to start upon user interaction with the game
                         such as pressing the jump key or collecting the first diamond 
                         (View console and link in console for more clarification).
                         Sound effects were also added for crucial events such as:
                         when the game character jumps, collects a diamond,
                         falls into a canyon, gets killed by enemies or 
                         completes the level by reaching the flagpole.
                         This made the game more engaging and interactive.

EXTENSION 2: Create Enemies - A constructor function was used to create multiple enemies
                              that move within a given range and to check 
                              when the game character contacts one of them.
                              The game was then populated with 10 enemies randomly positioned
                              on the x axis to make the game unpredictable and thus harder.

OTHER EXTENSIONS

Create Platforms - A factory pattern was used to create 3 particularly positioned platforms.

Add Advanced Graphics - Some code contained in objects, although lengthy, were for 
                        the purpose of enhancing realism while still being true to 
                        the 2D game genre by maintaining a simple cartoonish appearance.
                        These objects particularly include canyons, enemies and game character.
                        

DIFFICULT BIT
It was difficult figuring out the logic to make the game character 
jump off a platform to avoid enemies. This has since been resolved.


LEARNT SKILLS
Several skills have been learnt during this project including creating objects 
(I am most proud of the designs for my canyons and enemies) 
and being able to replicate these objects using constructor functions.
However, for creative reasons and some control over the scenery, 
I only chose to use a constructor function and random function for enemies
and a factory pattern and random function for platforms. 
Background objects like trees, canyons and mountains, on the other hand, 
were carefully and creatively placed to produce a certain scenery and tell a story 
about a Baby Ninja trying to escape a jungle (with fellow Ninjas trying to stop her), 
hence, the sparsely populated trees towards the end as the Baby Ninja nears success.

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var trees_x;
var clouds;
var mountains;
var collectables;
var canyons;
var platforms;

var game_score;
var flagpole;
var lives;

var enemies;

var jumpSound;
var collectSound;
var dieSound;
var killedSound;
var levelCompleteSound;
var backgroundSound;

function preload()
{
    soundFormats('mp3','wav');
    
    //load some sound effects
    jumpSound = loadSound("assets/jump.wav");
    jumpSound.setVolume(0.1);
    
    collectSound = loadSound("assets/collect.mp3");
    collectSound.setVolume(0.1);
    
    dieSound = loadSound("assets/die.wav");
    dieSound.setVolume(0.1);
    
    killedSound = loadSound("assets/killed.mp3");
    killedSound.setVolume(0.1);
    
    levelCompleteSound = loadSound("assets/level-complete.mp3");
    levelCompleteSound.setVolume(0.1);
    
    backgroundSound = loadSound("assets/background.mp3");
    backgroundSound.setVolume(0.1);
}


function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
    lives = 3;
    
    // Start the game with all variables initialised.
    startGame();
    
    // Play and loop background music.
    backgroundSound.play();
    backgroundSound.loop();
}

function draw()
{
	// Fill the sky blue.
    background(100, 155, 255);

    // Draw some green ground.
	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4);
    
    // Move background scenery in opposite direction.
    push();
    translate(scrollPos, 0);

	// Draw clouds.
    drawClouds();

	// Draw mountains.
    drawMountains();

	// Draw trees.
    drawTrees();

    // Draw Platforms.
    for(var i = 0; i < platforms.length; i++)
    {
        platforms[i].draw();
    }

	// Draw canyons.
    for(var i = 0; i < canyons.length; i++)
    {
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }
    
	// Draw collectable items.
    for(var i = 0; i < collectables.length; i++)
    {
        if(collectables[i].isFound == false)
        {
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);
        }
    }
    
    // Check if flagpole is reached.
    if(flagpole.isReached == false)
    {
        checkFlagpole();
    }
    
    // Render flagpole to move with background scenery.
    renderFlagpole();
    
    // Iterate over and draw all enemies to screen.
    for(var i = 0; i < enemies.length; i++)
    {
        enemies[i].draw();
        
        var isContact = enemies[i].checkContact(gameChar_world_x, 
                                                gameChar_y);

        if(isContact)
        {
            if(lives > 0)
            {     
                lives -= 1;
                backgroundSound.stop();
                
                startGame();
                backgroundSound.play();
                backgroundSound.loop();
                
                break;
            }
        }
        
        // Stop background music when gameChar is killed.
        else if (lives == 0)
        {
            backgroundSound.stop();
        }
    }
    
    // Create the illusion of motion for game character.
    pop();

	// Draw game character.
	drawGameChar();
    
    // Print score and update as collectables are found.
    fill(200,0,200);
    noStroke();
    textSize(30);
    textAlign(RIGHT);
    text("Score: " + game_score, width - 50, 50);
    
    // Print the text, "Lives" on screen beside life tokens.
    fill(200,0,200);
    noStroke();
    textSize(30);
    textAlign(LEFT);
    text("Lives: ", 50, 50);
    
    // Draw life tokens and set to show remaining lives.
    for(var i = 0; i < lives; i++)
    {
        fill(0,255,0);
        strokeWeight(2);
        stroke(200,0,200);
        ellipse(150 + i * 50, 40, 30, 30);
    }
    
    // Print Game Over or Level Complete on screen. 
    // Then, return to stop remaining logic from executing.
    
    if(lives < 1)
    {
        fill(200,0,200);
        strokeWeight(2);
        stroke(0);
        textSize(50);
        textAlign(CENTER);
        text("Game Over! \n Press space twice to continue.", 
             width/2, 
             height/2);
        
        return;
    }
    
    else if(flagpole.isReached)
    {
        fill(200,0,200);
        strokeWeight(2);
        stroke(0);
        textSize(50);
        textAlign(CENTER);
        text("Level Complete! \n You've escaped the jungle.", 
             width/2, 
             height/2);
        
        return;
    }
    
	// Logic to make game character move and background scroll.
    
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
        }
        
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
        
        else
		{
			// Negative for moving against the background.
            scrollPos -= 5;
		}
	}

	// Logic to make the game character rise and fall.
       
    if(gameChar_y < floorPos_y)
    {
        var isContact = false;
        
        for(var i = 0; i < platforms.length; i++)
        {
            if(platforms[i].checkContact(gameChar_world_x, 
                                         gameChar_y))
            {
                isContact = true;
                break;
            }
        }

        if(isContact == false)
        {
            gameChar_y += 3;
            isFalling = true;
        }
    }
    
    else
    {
        isFalling = false;
    }
    
    // Logic to make the game character plummet.
    
    if(isPlummeting == true)
    {
        gameChar_y += 8;
        
        // Play sound effect for game character dying.
        dieSound.play();
    }
    
    else
    {
        isPlummeting = false;
    }
    
    // Check when character dies after falling into canyon. 
    // Then, update lives and restart or end game if no lives left.
    checkPlayerDie();
    
    // Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{      
    if(keyCode == 37 && !flagpole.isReached)
    {
        isLeft = true;
    }
    
    else if(keyCode == 39 && !flagpole.isReached)
    {
        isRight = true;
    }
    
    // Logic to make game character jump.
    else if((!flagpole.isReached) && 
            ((keyCode == 32 && 
              gameChar_y >= floorPos_y && 
              gameChar_y <= floorPos_y + 10) || 
             (keyCode == 32 &&
              gameChar_y <= 397 &&
              gameChar_y >= 385)))
    {
        gameChar_y -= 100;
        
        // Play sound effect for game character jumping.
        jumpSound.play();
    }
    
    // Logic for game over, push spacebar to continue.
    else if (keyCode == 32 && 
             lives == 0 && 
             !flagpole.isReached)
    {
        startGame();
        backgroundSound.play();
        backgroundSound.loop();
        lives = 3;
        game_score = 0;
    }
}

function keyReleased()
{   
    if(keyCode == 37)
    {
        isLeft = false;
    }
    
    else if(keyCode == 39)
    {
        isRight = false;
    }
}


// ------------------------------
// Game character render function
// ------------------------------

function drawGameChar()
{    
	// Detect (and draw) when game character jumps left.
    
	if(isLeft && isFalling)
	{   
        //Draw the legs
        fill(87, 63, 10);
        quad(gameChar_x + 9, gameChar_y - 22, 
             gameChar_x + 22, gameChar_y - 18, 
             gameChar_x + 18, gameChar_y - 11, 
             gameChar_x + 4, gameChar_y - 12);

        quad(gameChar_x - 9, gameChar_y - 22, 
             gameChar_x - 22, gameChar_y - 18, 
             gameChar_x - 18, gameChar_y - 11, 
             gameChar_x - 4, gameChar_y - 12);

        // Draw the body
        fill(200,220,100);
        stroke(0);
        strokeWeight(1);
        ellipse(gameChar_x, gameChar_y - 29, 36/1.5, 36);
        noStroke();

        //Draw the left arm raised while jumping
        fill(87, 63, 10);
        ellipse(gameChar_x - 2, gameChar_y - 36, 9.8);
        quad(gameChar_x - 2, gameChar_y - 41, 
             gameChar_x - 2, gameChar_y - 31, 
             gameChar_x - 16, gameChar_y - 35, 
             gameChar_x - 17, gameChar_y - 45);

        // Draw the head 
        fill(200,220,100);
        stroke(0);
        strokeWeight(1);
        ellipse(gameChar_x, gameChar_y - 59, 30/1.5, 30);
        noStroke();
        
        // Draw the mask and eyes
        fill(87, 63, 10);
        ellipse(gameChar_x - 6, gameChar_y - 59, 10, 12);
        
        stroke(200,220,100);
        strokeWeight(4);
        point(gameChar_x - 7, gameChar_y - 59);
        noStroke();
	}
    
    // Detect (and draw) when game character jumps right.
    
	else if(isRight && isFalling)
	{   
        //Draw the legs
        fill(87, 63, 10);    
        quad(gameChar_x + 9, gameChar_y - 22, 
             gameChar_x + 22, gameChar_y - 18, 
             gameChar_x + 18, gameChar_y - 11, 
             gameChar_x + 4, gameChar_y - 12);

        quad(gameChar_x - 9, gameChar_y - 22, 
             gameChar_x - 22, gameChar_y - 18, 
             gameChar_x - 18, gameChar_y - 11, 
             gameChar_x - 4, gameChar_y - 12);

        // Draw the body
        fill(200,220,100);
        stroke(0);
        strokeWeight(1);
        ellipse(gameChar_x, gameChar_y - 29, 36/1.5, 36);
        noStroke();

        //Draw the right arm raised while jumping
        fill(87, 63, 10);    
        ellipse(gameChar_x + 2, gameChar_y - 36, 9.8);
        quad(gameChar_x + 2, gameChar_y - 41, 
             gameChar_x + 2, gameChar_y - 31, 
             gameChar_x + 16, gameChar_y - 35, 
             gameChar_x + 17, gameChar_y - 45);

        // Draw the head
        fill(200,220,100);
        stroke(0);
        strokeWeight(1);
        ellipse(gameChar_x, gameChar_y - 59, 30/1.5, 30);
        noStroke();
        
        // Draw the mask and eyes
        fill(87, 63, 10);
        ellipse(gameChar_x + 6, gameChar_y - 59, 10, 12);
        
        stroke(200,220,100);
        strokeWeight(4);
        point(gameChar_x + 7, gameChar_y - 59);
        noStroke();
	}
    
    // Detect (and draw) when game character walks left.

	else if(isLeft)
	{
        //Draw the legs
        fill(87, 63, 10);
        quad(gameChar_x - 9, gameChar_y - 15, 
             gameChar_x - 19, gameChar_y - 2, 
             gameChar_x - 9, gameChar_y - 2, 
             gameChar_x - 2, gameChar_y - 10);

        quad(gameChar_x + 10, gameChar_y - 15, 
             gameChar_x + 13, gameChar_y - 2, 
             gameChar_x + 4, gameChar_y - 2, 
             gameChar_x, gameChar_y - 10);

        // Draw the body
        fill(200,220,100);
        stroke(0);
        strokeWeight(1);
        ellipse(gameChar_x, gameChar_y - 23, 38/1.5, 38);
        noStroke();

        //Draw the left arm swinging
        fill(87, 63, 10);  
        ellipse(gameChar_x + 0.5, gameChar_y - 27.5, 8.5);
        quad(gameChar_x - 3, gameChar_y - 30, 
             gameChar_x - 11, gameChar_y - 17, 
             gameChar_x - 2, gameChar_y - 17, 
             gameChar_x + 4, gameChar_y - 25);

        // Draw the head
        fill(200,220,100);
        stroke(0);
        strokeWeight(1);
        ellipse(gameChar_x, gameChar_y - 53, 32/1.5, 32);
        noStroke();
        
        // Draw the mask and eyes
        fill(87, 63, 10);
        ellipse(gameChar_x - 6, gameChar_y - 53, 10, 12);
        
        stroke(200,220,100);
        strokeWeight(4);
        point(gameChar_x - 7, gameChar_y - 53);
        noStroke();
	}
    
    
    // Detect (and draw) when game character walks right.
    
	else if(isRight)
	{   
        //Draw the legs
        fill(87, 63, 10);
        quad(gameChar_x + 9, gameChar_y - 15, 
             gameChar_x + 19, gameChar_y - 2, 
             gameChar_x + 9, gameChar_y - 2, 
             gameChar_x + 2, gameChar_y - 10);

        quad(gameChar_x - 10, gameChar_y - 15, 
             gameChar_x - 13, gameChar_y - 2, 
             gameChar_x - 4, gameChar_y - 2, 
             gameChar_x, gameChar_y - 10);

        // Draw the body
        fill(200,220,100);
        stroke(0);
        strokeWeight(1);
        ellipse(gameChar_x, gameChar_y - 23, 38/1.5, 38);
        noStroke();

        //Draw the right arm swinging
        fill(87, 63, 10);
        ellipse(gameChar_x - 0.5, gameChar_y - 27.5, 8.5);
        quad(gameChar_x + 3, gameChar_y - 30, 
             gameChar_x + 11, gameChar_y - 17, 
             gameChar_x + 2, gameChar_y - 17, 
             gameChar_x - 4, gameChar_y - 25);

        // Draw the head
        fill(200,220,100);
        stroke(0);
        strokeWeight(1);
        ellipse(gameChar_x, gameChar_y - 53, 32/1.5, 32);
        noStroke();
        
        // Draw the mask and eyes
        fill(87, 63, 10);
        ellipse(gameChar_x + 6, gameChar_y - 53, 10, 12);
        
        stroke(200,220,100);
        strokeWeight(4);
        point(gameChar_x + 7, gameChar_y - 53);
        noStroke();
	}
    
    // Detect (and draw) game character jumping facing forward.
    
	else if(isFalling || isPlummeting)
	{   
        //Draw the legs
        fill(87, 63, 10);
        rect(gameChar_x - 13, gameChar_y - 16, 8, 8);

        rect(gameChar_x + 5, gameChar_y - 16, 8, 8);

        //Draw the arms
        fill(87, 63, 10);
        rect(gameChar_x - 21, gameChar_y - 44, 8, 8);

        rect(gameChar_x + 13, gameChar_y - 44, 8, 8);

        // Draw the body
        fill(200,220,100);
        stroke(0);
        strokeWeight(1);
        ellipse(gameChar_x, gameChar_y - 30, 38);
        noStroke();

        // Draw the head
        fill(200,220,100);
        stroke(0);
        strokeWeight(1);
        ellipse(gameChar_x, gameChar_y - 59, 30)
        noStroke();
        
        // Draw the mask and eyes
        fill(87, 63, 10);
        rect(gameChar_x - 12, gameChar_y - 64, 24, 10, 20);
        
        stroke(200,220,100);
        strokeWeight(4);
        point(gameChar_x - 7, gameChar_y - 59);
        point(gameChar_x + 7, gameChar_y - 59);
        noStroke();
	}
    
    // Detect (and draw) when game character stands front facing.
    
	else
	{   
        //Draw the legs
        fill(87, 63, 10);
        rect(gameChar_x - 15, gameChar_y - 11, 10, 10);
    
        rect(gameChar_x + 5, gameChar_y - 11, 10, 10);
    
        //Draw the arms
        fill(87, 63, 10);
        triangle(gameChar_x - 24, gameChar_y - 32, 
                 gameChar_x - 12, gameChar_y - 38, 
                 gameChar_x - 19, gameChar_y - 24);
    
        triangle(gameChar_x + 24, gameChar_y - 32, 
                 gameChar_x + 12, gameChar_y - 38, 
                 gameChar_x + 19, gameChar_y - 24);
    
        // Draw the body
        fill(200,220,100);
        stroke(0);
        strokeWeight(1)
        ellipse(gameChar_x, gameChar_y - 23, 38);
    
        // Draw the head
        fill(200,220,100);
        stroke(0);
        strokeWeight(1);
        ellipse(gameChar_x, gameChar_y - 53, 32);
        noStroke();
        
        // Draw the mask and eyes
        fill(87, 63, 10);
        rect(gameChar_x - 12, gameChar_y - 58, 24, 10, 20);
        
        stroke(200,220,100);
        strokeWeight(4);
        point(gameChar_x - 7, gameChar_y - 53);
        point(gameChar_x + 7, gameChar_y - 53);
        noStroke();
	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.

function drawClouds()
{
    for(i = 0; i < clouds.length; i++)
    {
        fill(255,255,255);
        ellipse(clouds[i].x_pos, 
                clouds[i].y_pos, 
                clouds[i].size);
        ellipse(clouds[i].x_pos - 35, 
                clouds[i].y_pos, 
                clouds[i].size - 10);
        ellipse(clouds[i].x_pos + 35, 
                clouds[i].y_pos, 
                clouds[i].size - 10);
        ellipse(clouds[i].x_pos + 65, 
                clouds[i].y_pos + 20, 
                clouds[i].size - 10);
        ellipse(clouds[i].x_pos - 65, 
                clouds[i].y_pos + 20, 
                clouds[i].size - 10);
        rect(clouds[i].x_pos - 70,
             clouds[i].y_pos + 9.75,
             140,
             30);
    }
}

// Function to draw mountain objects.

function drawMountains()
{
    for(i = 0; i < mountains.length; i++)
    {
        fill(124,138,164);
        triangle(mountains[i].x_pos - 220, 
                 floorPos_y,
                 mountains[i].x_pos, 
                 floorPos_y - mountains[i].y_pos + (mountains[i].size/2),
                 mountains[i].x_pos + 160, 
                 floorPos_y);

        // Shadow on the side of the mountain for some realism.
        fill(123, 133, 159);
        triangle(mountains[i].x_pos - 220, 
                 floorPos_y,
                 mountains[i].x_pos, 
                 floorPos_y - mountains[i].y_pos + (mountains[i].size/2),
                 mountains[i].x_pos - 190, 
                 floorPos_y);
    }   
}

// Function to draw trees objects.

function drawTrees()
{
    for(i = 0; i < trees_x.length; i++)
    {        
        // Tree trunk.
        fill(120,100,40);
        rect(trees_x[i], floorPos_y - 140, 40, 140);

        // Tree branches.
        fill(0,150,0);
        ellipse(trees_x[i] - 20, floorPos_y - 140, 100, 100);
        ellipse(trees_x[i], floorPos_y - 182, 100, 100);
        ellipse(trees_x[i] + 40, floorPos_y - 182, 100, 100);
        ellipse(trees_x[i] + 60, floorPos_y - 140, 100, 100);
    }
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

function drawCanyon(t_canyon)
{   
    // Edges of Canyon.
    fill(150,50,40);
    quad(t_canyon.x_pos + t_canyon.width/2, 
         floorPos_y,
         t_canyon.x_pos - t_canyon.width/2, 
         floorPos_y,
         t_canyon.x_pos  - t_canyon.width/2, 
         floorPos_y + 38,
         t_canyon.x_pos + t_canyon.width/2, 
         floorPos_y + 38);

    quad(t_canyon.x_pos - 5 + t_canyon.width/2, 
         floorPos_y + 38,
         t_canyon.x_pos + 5 - t_canyon.width/2, 
         floorPos_y + 38,
         t_canyon.x_pos + 5 - t_canyon.width/2, 
         floorPos_y + 78,
         t_canyon.x_pos - 5 + t_canyon.width/2, 
         floorPos_y + 78);

    quad(t_canyon.x_pos - 10 + t_canyon.width/2, 
         floorPos_y + 78,
         t_canyon.x_pos + 10 - t_canyon.width/2, 
         floorPos_y + 78,
         t_canyon.x_pos + 10 - t_canyon.width/2, 
         height,
         t_canyon.x_pos - 10 + t_canyon.width/2, 
         height);

    // Water flowing in canyon.
    fill(119,186,228);
    quad(t_canyon.x_pos - 10 + t_canyon.width/2, 
         floorPos_y + 98,
         t_canyon.x_pos + 10 - t_canyon.width/2, 
         floorPos_y + 98,
         t_canyon.x_pos + 10 - t_canyon.width/2, 
         height,
         t_canyon.x_pos - 10 + t_canyon.width/2, 
         height);

    // Line atop water for some realism.
    stroke(255);
    line(t_canyon.x_pos - 11 + t_canyon.width/2, 
         floorPos_y + 98,
         t_canyon.x_pos + 10 - t_canyon.width/2, 
         floorPos_y + 98);

    // Lines along canyon edges for some realism.
    stroke(0);
    strokeWeight(3);
    
    line(t_canyon.x_pos + t_canyon.width/2, 
         floorPos_y,
         t_canyon.x_pos + t_canyon.width/2, 
         floorPos_y + 38);
    line(t_canyon.x_pos - t_canyon.width/2, 
         floorPos_y,
         t_canyon.x_pos  - t_canyon.width/2, 
         floorPos_y + 38);
    line(t_canyon.x_pos - 5 + t_canyon.width/2, 
         floorPos_y + 38,
         t_canyon.x_pos - 5 + t_canyon.width/2, 
         floorPos_y + 78);
    line(t_canyon.x_pos + 5 - t_canyon.width/2, 
         floorPos_y + 38,
         t_canyon.x_pos + 5 - t_canyon.width/2, 
         floorPos_y + 78);
    line(t_canyon.x_pos - 10 + t_canyon.width/2, 
         floorPos_y + 78,
         t_canyon.x_pos - 10 + t_canyon.width/2, 
         height);
    line(t_canyon.x_pos + 10 - t_canyon.width/2, 
         floorPos_y + 78,
         t_canyon.x_pos + 10 - t_canyon.width/2, 
         height);
    
    strokeWeight(1);
    noStroke();
}

function checkCanyon(t_canyon)
{      
    // Detect game character over canyon and make it plummet.
     
    if(gameChar_world_x < t_canyon.x_pos + t_canyon.width/1.7 
       && gameChar_world_x > t_canyon.x_pos - 50 
       && gameChar_y >= floorPos_y)
    {
        isPlummeting = true;
    }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

function drawCollectable(t_collectable)
{
    fill(255,0,255,200);
    stroke(255);
    strokeWeight(2);
    quad(t_collectable.x_pos, 
         t_collectable.y_pos - (t_collectable.size/2),
         t_collectable.x_pos + (t_collectable.size/2), 
         t_collectable.y_pos,
         t_collectable.x_pos, 
         t_collectable.y_pos + (t_collectable.size/2),
         t_collectable.x_pos - (t_collectable.size/2), 
         t_collectable.y_pos);
    line(t_collectable.x_pos + (t_collectable.size/2), 
         t_collectable.y_pos,
         t_collectable.x_pos - (t_collectable.size/2), 
         t_collectable.y_pos)
    noStroke();
}

// Function to check if character has collected an item.

function checkCollectable(t_collectable)
{
    if(dist(gameChar_world_x, gameChar_y, 
            t_collectable.x_pos, t_collectable.y_pos) <= 90)
    {
        t_collectable.isFound = true;
        
        // Play sound effect for collectable is found.
        collectSound.play();
        
        game_score += 1;
    }
    
    else if(t_collectable.isFound == false)
    {
        fill(255,0,255,200);
        stroke(255);
        strokeWeight(2);
        
        // Drawing diamond top
        triangle(t_collectable.x_pos, 
        t_collectable.y_pos - (t_collectable.size/2),
        t_collectable.x_pos + (t_collectable.size/2),
        t_collectable.y_pos, 
        t_collectable.x_pos - (t_collectable.size/2),
        t_collectable.y_pos);

        // Drawing diamond bottom
        triangle(t_collectable.x_pos,
        t_collectable.y_pos + (t_collectable.size/2),
        t_collectable.x_pos + (t_collectable.size/2),
        t_collectable.y_pos, 
        t_collectable.x_pos - (t_collectable.size/2),
        t_collectable.y_pos);
        
        noStroke();
    }
}

// ---------------------------------
// Game Play Start, Flagpole render and Check 
// (Game Over and Level Complete) functions
// ---------------------------------

function startGame()
{   
    gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store real position of gameChar in game world.
	// Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control movement of game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects below.
       
    // Array of Trees' Positions.
    trees_x = [
        -500, 100, 500, 1100, 1500, 1800, 2700, 
        3300, 3700, 4600, 6000, 6750, 7000
    ];
       
    // Array of Cloud Objects.
    clouds = [
        {x_pos: 150, y_pos: 50, size: 50}, 
        {x_pos: 650, y_pos: 100, size: 50}, 
        {x_pos: 450, y_pos: 50, size: 50},
        {x_pos: 1050, y_pos: 100, size: 50}, 
        {x_pos: 1450, y_pos: 100, size: 50}, 
        {x_pos: 1850, y_pos: 50, size: 50},
        {x_pos: 2450, y_pos: 100, size: 50}, 
        {x_pos: 3850, y_pos: 50, size: 50},
        {x_pos: 4450, y_pos: 100, size: 50}, 
        {x_pos: 5650, y_pos: 50, size: 50},
        {x_pos: 6250, y_pos: 50, size: 50},
        {x_pos: 7650, y_pos: 100, size: 50}, 
        {x_pos: 8050, y_pos: 50, size: 50}
    ];
    
    // Array of Mountain Objects.
    mountains = [
        {x_pos: 410, y_pos: 300, size: 200},
        {x_pos: 1000, y_pos: 350, size: 200},
        {x_pos: 100, y_pos: 250, size: 200},
        {x_pos: 1410, y_pos: 200, size: 100},
        {x_pos: 2000, y_pos: 350, size: 200},
        {x_pos: 3500, y_pos: 250, size: 200},
        {x_pos: 5000, y_pos: 350, size: 250},
        {x_pos: 7500, y_pos: 250, size: 200}
    ];
        
    // Array of Collectable Objects.
    collectables = [
        {x_pos: 70, y_pos: 400, size: 50, isFound: false},
        {x_pos: 450, y_pos: 350, size: 50, isFound: false},
        {x_pos: 1500, y_pos: 360, size: 50, isFound: false},
        {x_pos: 2100, y_pos: 400, size: 50, isFound: false},
        {x_pos: 3500, y_pos: 330, size: 50, isFound: false},
        {x_pos: 5100, y_pos: 300, size: 50, isFound: false},
        {x_pos: 6000, y_pos: 400, size: 50, isFound: false},
        {x_pos: 6900, y_pos: 330, size: 50, isFound: false},
        {x_pos: 7800, y_pos: 300, size: 50, isFound: false},
        {x_pos: 8500, y_pos: 300, size: 70, isFound: false}
    ];
        
    // Array of Canyon Objects.
    canyons = [
        {x_pos: 0, width: 100},
        {x_pos: 650, width: 100},
        {x_pos: 200, width: 100},
        {x_pos: 1000, width: 100},
        {x_pos: 1500, width: 100},
        {x_pos: 2650, width: 100},
        {x_pos: 3050, width: 100},
        {x_pos: 4000, width: 100},
        {x_pos: 5500, width: 100},
        {x_pos: 7650, width: 100},
        {x_pos: 7800, width: 100},
        {x_pos: 8700, width: 100}
    ];
    
    // Create several platforms.
    platforms = [];
    
    platforms.push(createPlatforms(680, floorPos_y - 45, 100));
    platforms.push(createPlatforms(2200, floorPos_y - 45, 200));
    platforms.push(createPlatforms(4000, floorPos_y - 45, 100));
    
    // Initialise game score.
    game_score = 0;
    
    // Initialise flagpole.
    flagpole = {isReached: false, x_pos: 8000};
    
    // Populate game with enemies.
    enemies = [];
    
    for(var i = 0; i < 10; i++)
    {
        enemies.push(new Enemies(random(100, 8000), 
                                 floorPos_y - 10, 
                                 100));
    }
}

// Function to check and render flagpole accordingly.

function renderFlagpole()
{
    push();    // To set strokeWeight in isolation.
    strokeWeight(5);
    stroke(255,0,0);
    line(flagpole.x_pos, 
         floorPos_y, 
         flagpole.x_pos, 
         floorPos_y - 250);
    fill(255,0,255);
    noStroke();
    
    if(flagpole.isReached)
    {
        rect(flagpole.x_pos, floorPos_y - 250, 50,50);
    }
    
    else
    {
        rect(flagpole.x_pos, floorPos_y - 50, 50,50);
    }
 
    pop();     // To cancel strokeWeight after flagpole is drawn.
}

// Function to check if character has reached flagpole.

function checkFlagpole()
{
    var d = abs(gameChar_world_x - flagpole.x_pos);
    
    if(d < 15)
    {
        flagpole.isReached = true;
        
        // Stop background music. 
        // Play and end sound effect for level completed.
        backgroundSound.stop();
        levelCompleteSound.play();
        stop();
    }
}

// Function to check when character dies after falling into canyon.

function checkPlayerDie()
{
    if (gameChar_y > height + 100)
    {
        lives -= 1;
        
        if(lives > 0 && lives < 3)
        {
            backgroundSound.stop();
            
            startGame();
            backgroundSound.play();
            backgroundSound.loop();
        }
        
        // Stop background music when gameChar dies.
        else if (lives == 0)
        {
            backgroundSound.stop();
        }
    }  
}

// Factory pattern to create platforms for character to jump onto.

function createPlatforms(x, y , length)
{
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function()
        {
            fill(0, 165, 0);
            stroke(100,0,0);
            //stroke(0);
            strokeWeight(3);
            rect(this.x, this.y, this.length, 20, 30);
            noStroke();
        },
        
        checkContact: function(gc_x, gc_y)
        {
            if(gc_x > this.x && gc_x < this.x + this.length)
            {
                var d = this.y - gc_y + 11;

                if(d >= 0 && d < 5)
                {
                    return true;
                }
            }
            
            return false;
        }        
    }
    
    return p;
}

// Constructor function to create multiple enemies.

function Enemies(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    
    this.currentX = x;
    this.inc = 1;
    
    this.update = function()
    {
        this.currentX += this.inc;
        
        if(this.currentX >= this.x + this.range)
        {
            this.inc = -1;
        }
        
        else if (this.currentX < this.x)
        {
            this.inc = 1;
        }
    };
    
    this.draw = function()
    {
        this.update();
        
        // Draw the enemy below.
        
        // Draw the head
        fill(255, 0, 0)
        stroke(0);
        strokeWeight(1);
        arc(this.currentX, 
            this.y, 
            40, 
            40, 
            (PI + 26)/12, 
            (PI + 5)/12, 
            CHORD);
        noStroke();
        
        // Draw the mask and eyes
        fill(0);
        rect(this.currentX - 15, this.y - 5, 30, 10, 20);
        
        stroke(255,0,0);
        strokeWeight(4);
        point(this.currentX - 8, this.y);
        point(this.currentX + 8, this.y);
        noStroke();
        
        // Draw the teeth.
        stroke(0);
        triangle(this.currentX - 8.6, this.y + 10.5, 
                 this.currentX - 8.4, this.y + 10.2, 
                 this.currentX - 8.2, this.y + 10.5); 
        
        triangle(this.currentX - 0.1, this.y + 10.5, 
                 this.currentX + 0.1, this.y + 10.2, 
                 this.currentX + 0.3, this.y + 10.5)
        
        triangle(this.currentX + 8, this.y + 10.5, 
                 this.currentX + 8.2, this.y + 10.2, 
                 this.currentX + 8.4, this.y + 10.5)
    };
    
    this.checkContact = function(gc_x, gc_y)
    {
        var d = dist(gc_x, gc_y, this.currentX, this.y)
        
        if(d < 20)
        {
            // Play sound effect for game character killed.
            killedSound.play();
            
            return true;
        }
        
        return false;
    };
}