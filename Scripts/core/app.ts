(function(){
    // Function scoped Variables
    let stage: createjs.Stage;
    let assets: createjs.LoadQueue;

    let slotMachineBackground: Core.GameObject;
    let leftReel: Core.GameObject;
    let middleReel: Core.GameObject;
    let rightReel: Core.GameObject;
    let betLine: Core.GameObject;

    let spinButton: UIObjects.Button;
    let resetButton: UIObjects.Button;
    let bet10Button: UIObjects.Button;
    let bet100Button: UIObjects.Button;
    let betMaxButton: UIObjects.Button;

    let jackPotLabel: UIObjects.Label;
    let creditLabel: UIObjects.Label;
    let winningsLabel: UIObjects.Label;
    let betLabel: UIObjects.Label;
    

    // symbol tallies
    let grapes = 0;
    let bananas = 0;
    let oranges = 0;
    let cherries = 0;
    let bars = 0;
    let bells = 0;
    let sevens = 0;
    let blanks = 0;
    let playerBet = 0;
    let winnings = 0;
    let credit = 2000;
    let jackpot = 10000;
    let winRatio =0;
    let turn =0;
    let winNumber = 0;
    let lossNumber = 0;
    

    let manifest: Core.Item[] = [
        {id:"background", src:"./Assets/images/background.png"},
        {id:"banana", src:"./Assets/images/banana.gif"},
        {id:"bar", src:"./Assets/images/bar.gif"},
        {id:"bell", src:"./Assets/images/bell.gif"},
        {id:"bet_line", src:"./Assets/images/bet_line.gif"},
        {id:"resetButton", src:"./Assets/images/resetButton.png"},
        {id:"bet10Button", src:"./Assets/images/bet10Button.png"},
        {id:"bet100Button", src:"./Assets/images/bet100Button.png"},
        {id:"betMaxButton", src:"./Assets/images/betMaxButton.png"},
        {id:"blank", src:"./Assets/images/blank.gif"},
        {id:"cherry", src:"./Assets/images/cherry.gif"},
        {id:"grapes", src:"./Assets/images/grapes.gif"},
        {id:"orange", src:"./Assets/images/orange.gif"},
        {id:"seven", src:"./Assets/images/seven.gif"},
        {id:"spinButton", src:"./Assets/images/spinButton.png"},
    ];   

    // This function triggers first and "Preloads" all the assets
    function Preload()
    {
        assets = new createjs.LoadQueue();
        assets.installPlugin(createjs.Sound);
        assets.on("complete", Start);

        assets.loadManifest(manifest);
    }
    
    // This function triggers after everything has been preloaded
    // This function is used for config and initialization
    function Start():void
    {
        console.log("App Started...");
        let canvas = document.getElementById("canvas") as HTMLCanvasElement;
        stage = new createjs.Stage(canvas);
        createjs.Ticker.framerate = 60; // 60 FPS or 16.667 ms
        createjs.Ticker.on("tick", Update);

        stage.enableMouseOver(20);

        Config.Globals.AssetManifest = assets;

        Main();
    }

    // called every frame
    function Update(): void
    {
        stage.update();
    }
    
    /* Utility function to check if a value falls within a range of bounds */
    function checkRange(value:number, lowerBounds:number, upperBounds:number):number | boolean 
    {
        if (value >= lowerBounds && value <= upperBounds)
        {
            return value;
        }
        else {
            return !value;
        }
    }

    /* When this function is called it determines the betLine results.
    e.g. Bar - Orange - Banana */
    function Reels():string[] 
    {
        let betLine = [" ", " ", " "];
        let outCome = [0, 0, 0];

        for (var spin = 0; spin < 3; spin++) 
        {
            outCome[spin] = Math.floor((Math.random() * 65) + 1);
            switch (outCome[spin]) 
            {
                case checkRange(outCome[spin], 1, 27):  // 41.5% probability
                    betLine[spin] = "blank";
                    blanks++;
                    break;
                case checkRange(outCome[spin], 28, 37): // 15.4% probability
                    betLine[spin] = "grapes";
                    grapes++;
                    break;
                case checkRange(outCome[spin], 38, 46): // 13.8% probability
                    betLine[spin] = "banana";
                    bananas++;
                    break;
                case checkRange(outCome[spin], 47, 54): // 12.3% probability
                    betLine[spin] = "orange";
                    oranges++;
                    break;
                case checkRange(outCome[spin], 55, 59): //  7.7% probability
                    betLine[spin] = "cherry";
                    cherries++;
                    break;
                case checkRange(outCome[spin], 60, 62): //  4.6% probability
                    betLine[spin] = "bar";
                    bars++;
                    break;
                case checkRange(outCome[spin], 63, 64): //  3.1% probability
                    betLine[spin] = "bell";
                    bells++;
                    break;
                case checkRange(outCome[spin], 65, 65): //  1.5% probability
                    betLine[spin] = "seven";
                    sevens++;
                    break;
            }
        }
        return betLine;
    }
    /* This function calculates the player's winnings, if any */
    
    function buildInterface(): void
    {
        // Slot Machine Background
        slotMachineBackground = new Core.GameObject("background", Config.Screen.CENTER_X, Config.Screen.CENTER_Y, true );
        stage.addChild(slotMachineBackground);

        // Buttons
        spinButton = new UIObjects.Button("spinButton", Config.Screen.CENTER_X + 135, Config.Screen.CENTER_Y + 176, true);
        stage.addChild(spinButton);

        resetButton = new UIObjects.Button("resetButton", Config.Screen.CENTER_X - 135, Config.Screen.CENTER_Y + 176, true);
        stage.addChild(resetButton);

        bet10Button = new UIObjects.Button("bet10Button", Config.Screen.CENTER_X - 67, Config.Screen.CENTER_Y + 176, true);
        stage.addChild(bet10Button);

        bet100Button = new UIObjects.Button("bet100Button", Config.Screen.CENTER_X, Config.Screen.CENTER_Y + 176, true);
        stage.addChild(bet100Button);

        betMaxButton = new UIObjects.Button("betMaxButton", Config.Screen.CENTER_X + 67, Config.Screen.CENTER_Y + 176, true);
        stage.addChild(betMaxButton);

        // Labels
        jackPotLabel = new UIObjects.Label("5000", "20px", "Consolas", "#FF0000", Config.Screen.CENTER_X, Config.Screen.CENTER_Y - 175, true);
        stage.addChild(jackPotLabel);

        creditLabel = new UIObjects.Label("2000", "20px", "Consolas", "#FF0000", Config.Screen.CENTER_X - 94, Config.Screen.CENTER_Y + 108, true);
        stage.addChild(creditLabel);

        winningsLabel = new UIObjects.Label("0", "20px", "Consolas", "#FF0000", Config.Screen.CENTER_X + 94, Config.Screen.CENTER_Y + 108, true);
        stage.addChild(winningsLabel);

        betLabel = new UIObjects.Label("0", "20px", "Consolas", "#FF0000", Config.Screen.CENTER_X, Config.Screen.CENTER_Y + 108, true);
        stage.addChild(betLabel);

        // Reel GameObjects
        leftReel = new Core.GameObject("blank", Config.Screen.CENTER_X - 79, Config.Screen.CENTER_Y - 12, true);
        stage.addChild(leftReel);

        middleReel = new Core.GameObject("blank", Config.Screen.CENTER_X, Config.Screen.CENTER_Y - 12, true);
        stage.addChild(middleReel);

        rightReel = new Core.GameObject("blank", Config.Screen.CENTER_X + 78, Config.Screen.CENTER_Y - 12, true);
        stage.addChild(rightReel);

        // Bet Line
        betLine = new Core.GameObject("bet_line", Config.Screen.CENTER_X, Config.Screen.CENTER_Y - 12, true);
        stage.addChild(betLine);
    }
    /* Utility function to reset all fruit tallies */
    function resetFruitTally() : void
    {
        grapes = 0;
        bananas = 0;
        oranges = 0;
        cherries = 0;
        bars = 0;
        bells = 0;
        sevens = 0;
        blanks = 0;
    }
    
    /* Utility function to reset the player stats */
    function resetAll() : void 
    {
        credit = 1000;
        winnings = 0;
        jackpot = 5000;
        turn = 0;
        playerBet = 0;
        winNumber = 0;
        lossNumber = 0;
        winRatio = 0;
    }
    
    /* Check to see if the player won the jackpot */
    function checkJackPot() : void
    {
        /* compare two random values */
        let jackPotTry = Math.floor(Math.random() * 51 + 1);
        let jackPotWin = Math.floor(Math.random() * 51 + 1);
        if (jackPotTry == jackPotWin) 
        {
            alert("You Won the $" + jackpot + " Jackpot!!");
            credit += jackpot;
            jackpot = 5000;
        }
    }
    /* Utility function to show a win message and increase player money */
    function WinMessage() : void
    {
        credit += winnings
        console.log("Congratulation! You win");
        // Update winningsLabel
        winningsLabel.setText(winnings.toString());
        // Update the creditLabel
        creditLabel.setText(credit.toString());
        
        resetFruitTally();
        checkJackPot();

    }

/* Utility function to show a loss message and reduce player money */
    function LossMessage() : void
    {
        credit -= playerBet
        console.log("Sorry! You lose");
        // Update the creditLabel
        creditLabel.setText(credit.toString());
        resetFruitTally();
    }
    
    //This function calculates the player's winnings, if any 
    function determineWinnings(): void 
    {
    if (blanks == 0) 
        {
            if (grapes == 3) 
            {
                winnings = playerBet * 10;
            } 
            else if (bananas == 3) 
            {
                winnings = playerBet * 20;
            } 
            else if (oranges == 3) 
            {
                winnings = playerBet * 30;
            } 
            else if (cherries == 3) {
                winnings = playerBet * 40;
            } 
            else if (bars == 3) {
                winnings = playerBet * 50;
            }
            else if (bells == 3) {
                winnings = playerBet * 60;
            } 
            else if (sevens == 3) {
                winnings = playerBet * 100;
            } 
            else if (grapes == 2) {
                winnings = playerBet * 2;
            } 
            else if (bananas == 2) {
                winnings = playerBet * 2;
            } 
            else if (oranges == 2) {
                winnings = playerBet * 3;
            } 
            else if (cherries == 2) {
                credit += winnings;
            } 
            else if (bars == 2) {
            } 
            else if (bells == 2) {
                winnings = playerBet * 10;
            } 
            else if (sevens == 2) {
                winnings = playerBet * 20;
            } 
            else if (sevens == 1) {
                winnings = playerBet * 5;
            }
            else if (grapes == 1)
            {
                winnings = playerBet * 1;
            }
            WinMessage();
        }
        else
        {
            LossMessage();
            credit -= winnings
        }
    }

    function interfaceLogic():void
    {
        spinButton.on("click", ()=>
        {
            winningsLabel.setText("0");
            winnings = 0;

            let reels = Reels();

            if (playerBet > credit) 
            {
                alert("You don't have enough Money to place that bet.");
            }
            else if (playerBet == 0) 
            {
                alert("Please Enter Your Bet First");
            }
            else if (playerBet <= credit)
            {
                //Replacing images in the reels
                leftReel.image = assets.getResult(reels[0]) as HTMLImageElement;
                middleReel.image = assets.getResult(reels[1]) as HTMLImageElement;
                rightReel.image = assets.getResult(reels[2]) as HTMLImageElement;
                
                determineWinnings();
                winningsLabel.text = winnings.toString();
                creditLabel.text = credit.toString();
            }
            else 
            {
                alert("Please enter a valid bet amount");
            }
            checkJackPot();
            
        });

        resetButton.on("click", ()=>
        {
            console.log("Reset button clicked");
            resetAll();

            jackPotLabel.setText(jackpot.toString());
            winningsLabel.setText("0");
            creditLabel.setText(credit.toString());
            betLabel.setText("0");

            leftReel.image = assets.getResult("blank") as HTMLImageElement;
            middleReel.image = assets.getResult("blank") as HTMLImageElement;
            rightReel.image = assets.getResult("blank") as HTMLImageElement;

        });
        bet10Button.on("click", ()=>
        {
            console.log("bet10Button Button Clicked");
            playerBet += 10;
            betLabel.setText(playerBet.toString());
        });
        bet100Button.on("click", ()=>
        {
            console.log("bet100Button Button Clicked");
            playerBet += 100;
            betLabel.setText(playerBet.toString());
        });
        betMaxButton.on("click", ()=>
        {
            console.log("betMaxButton Button Clicked");
            playerBet += 200;
            betLabel.setText(playerBet.toString());

        });
    }
    // app logic goes here
    function Main(): void
    {
        buildInterface();

        interfaceLogic();
       
    }

    window.addEventListener("load", Preload);
})();