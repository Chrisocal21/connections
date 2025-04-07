/**
 * Reclaimed Game Logic
 * A post-apocalyptic survival game where players rebuild civilization
 * Version 1.1.0 - Updated April 2025
 */

class ReclaimedGame {
  constructor() {
    // Current game version - update this when making significant changes
    this.gameVersion = "1.1.0";
    
    this.gameState = {
      version: this.gameVersion,
      day: 1,
      resources: {
        food: 10,
        water: 15,
        materials: 5,
        people: 3
      },
      buildings: {
        shelters: 1,
        farms: 0,
        cisterns: 0,
        workshops: 0
      },
      events: [],
      discoveries: [],
      survivors: [],
      leadershipScore: 0,
      storyPhase: 'awakening', // awakening, survival, expansion, revelation
      journal: [], // New array to store journal entries
      actionsRemaining: 5, // Add daily action limit
      maxActionsPerDay: 5, // Max actions per day
      weather: 'Clear' // Current weather
    };
    
    // Initialize story journal entries
    this.journalEntries = {
      1: {
        title: "Awakening",
        author: "Sam",
        text: "I woke from stasis today. It's hard to put into words what I'm feeling. The world I knew is gone, and an impossible quiet has taken its place. I keep thinking I'll hear a car horn or a voice in the distance... but there's nothing. Just wind and my own footsteps."
      },
      3: {
        title: "Finding Hope",
        author: "Aria",
        text: "I can barely keep my hand steady to write this—I'm that excited. A few hours ago, Sam and I spotted smoke on the horizon. Smoke means people. It means someone else is out there!"
      },
      5: {
        title: "Not Alone",
        author: "Riley",
        text: "It's been almost two months since I woke up to this empty world. I haven't seen another living person since the day I crawled out of my bunker... until today. I found others. I'm not alone anymore."
      },
      7: {
        title: "Silent City",
        author: "Sam",
        text: "We reached the city today. The silence here is different - heavier somehow. Buildings that once housed thousands stand empty, with trees growing from windows and rooftops. It's beautiful in a haunting way. I keep wondering what happened to everyone. Did they know it was coming?"
      },
      10: {
        title: "First Signs",
        author: "Aria",
        text: "Found a newspaper from just before the Quiet Reset. The headline mentioned a 'mysterious phenomenon' alarming scientists. Whatever happened, it seems some people knew something was wrong. The real question is: why were we chosen to survive in the cryo-chambers?"
      },
      15: {
        title: "Reclaiming",
        author: "Riley",
        text: "Our little settlement is growing. It's strange to build something new in the shadow of the old world. Sometimes I look at the silent buildings around us and feel like we're being watched. But then I see what we've created, and I feel something I haven't felt in a long time: pride."
      }
    };
    
    // Initialize character data
    this.characters = {
      sam: {
        name: "Sam Cole",
        description: "A former systems engineer with a pragmatic approach to problems.",
        dialogues: {
          introduction: "I was a technician before the Quiet Reset. Good with machines, not so much with people. Guess that's changing now that there aren't many of us left.",
          scavenge: [
            "I think I see something useful over there.",
            "We should check that building for electronics.",
            "If we find any batteries or solar cells, we could use them."
          ],
          base: [
            "With a few more solar panels, we could expand the automation system.",
            "I've been mapping the area. There's a lot we could reclaim."
          ]
        }
      },
      aria: {
        name: "Dr. Aria Zhao",
        description: "A scientist who worked on the cryo program before the Quiet Reset.",
        dialogues: {
          introduction: "I helped design the cryo facilities. Never thought I'd actually need to use one. I know about the Quiet Reset... well, at least what they told us.",
          medical: [
            "I could set up a proper medical station if we find the right supplies.",
            "Keep an eye out for antibiotics or medical equipment."
          ],
          research: [
            "I've been analyzing what might have happened. The clues are there, if we look carefully.",
            "There's something about this silence that doesn't feel... natural."
          ]
        }
      },
      riley: {
        name: "Riley Porter",
        description: "A former security officer with survival skills honed by necessity.",
        dialogues: {
          introduction: "I was security for one of the cryo facilities. Woke up alone six months ago. Been moving ever since, looking for others.",
          hunting: [
            "I can teach you how to set traps for small game.",
            "The wildlife has thrived since we disappeared."
          ],
          defense: [
            "We should secure the perimeter. Just because we haven't seen other people doesn't mean they're not out there.",
            "I'll take first watch tonight."
          ]
        }
      }
    };
    
    // Story-driven quests
    this.quests = {
      "awakening": {
        title: "Awakening",
        description: "Find your way out of the bunker and learn what happened to the world.",
        objectives: [
          { id: "explore_bunker", text: "Explore the cryo facility", completed: false },
          { id: "find_supplies", text: "Gather basic supplies", completed: false },
          { id: "exit_bunker", text: "Find the exit to the surface", completed: false }
        ],
        rewards: {
          resources: { food: 5, water: 5 },
          items: ["basic_toolkit"]
        },
        followUp: "silent_streets"
      },
      "silent_streets": {
        title: "Silent Streets",
        description: "Explore the abandoned town and gather resources for survival.",
        objectives: [
          { id: "visit_store", text: "Check the grocery store for supplies", completed: false },
          { id: "find_map", text: "Find a map of the surrounding area", completed: false },
          { id: "secure_shelter", text: "Secure a temporary shelter for the night", completed: false }
        ],
        rewards: {
          resources: { food: 10, water: 8, materials: 5 },
          items: ["crank_flashlight"]
        },
        followUp: "distant_smoke"
      },
      "distant_smoke": {
        title: "Distant Smoke",
        description: "Investigate the smoke on the horizon - could someone else be out there?",
        objectives: [
          { id: "track_smoke", text: "Follow the smoke to its source", completed: false },
          { id: "meet_riley", text: "Meet the survivor", completed: false },
          { id: "share_stories", text: "Exchange information about the Quiet Reset", completed: false }
        ],
        rewards: {
          resources: { food: 5, water: 5, materials: 3 },
          companions: ["riley"]
        },
        followUp: "city_approach"
      }
    };
    
    // Weather types with effects on gameplay
    this.weatherTypes = {
      'Clear': {
        description: "A clear day with good visibility.",
        effects: {}
      },
      'Rainy': {
        description: "Rain falls steadily. Good for collecting water, harder for hunting.",
        effects: {
          waterCollectionMultiplier: 1.5,
          huntingSuccessModifier: 0.8
        }
      },
      'Stormy': {
        description: "A severe storm with heavy wind and rain.",
        effects: {
          waterCollectionMultiplier: 2.0,
          huntingSuccessModifier: 0.5,
          scavengeSuccessModifier: 0.7
        }
      },
      'Foggy': {
        description: "A thick fog limits visibility.",
        effects: {
          huntingSuccessModifier: 0.7
        }
      },
      'Hot': {
        description: "Unusually hot day. Requires more water.",
        effects: {
          waterConsumptionModifier: 1.5
        }
      },
      'Cold': {
        description: "Bitterly cold. Requires more food for energy.",
        effects: {
          foodConsumptionModifier: 1.5
        }
      }
    };
    
    this.init();
  }
  
  init() {
    console.log("Initializing Reclaimed game...");
    // Load saved game if exists
    const savedGame = localStorage.getItem('reclaimedGameSave');
    if (savedGame) {
      try {
        const parsedState = JSON.parse(savedGame);
        
        // Check if saved game version matches current version
        if (!parsedState.version || parsedState.version !== this.gameVersion) {
          console.log(`Game version mismatch: saved=${parsedState.version || 'unknown'}, current=${this.gameVersion}`);
          
          if (confirm("A new version of Reclaimed is available. Starting a new game is recommended for the best experience. Reset game data?")) {
            this.resetGame();
            alert("Game data reset. Enjoy the new version!");
          } else {
            // Try to upgrade the saved state to be compatible with current version
            this.upgradeGameState(parsedState);
          }
        } else {
          // Same version, just load the game
          this.gameState = parsedState;
          console.log("Loaded saved game from day", this.gameState.day);
        }
      } catch (e) {
        console.error("Error loading saved game:", e);
        alert("There was an error loading your saved game. Starting a new game.");
        this.resetGame();
      }
    }
  }
  
  upgradeGameState(oldState) {
    console.log("Attempting to upgrade saved game state...");
    
    // Make sure all required properties exist in the saved state
    this.gameState = {
      version: this.gameVersion,
      day: oldState.day || 1,
      resources: {
        food: oldState.resources?.food || 10,
        water: oldState.resources?.water || 15,
        materials: oldState.resources?.materials || 5,
        people: oldState.resources?.people || 3
      },
      buildings: {
        shelters: oldState.buildings?.shelters || 1,
        farms: oldState.buildings?.farms || 0,
        cisterns: oldState.buildings?.cisterns || 0,
        workshops: oldState.buildings?.workshops || 0
      },
      events: oldState.events || [],
      discoveries: oldState.discoveries || [],
      survivors: oldState.survivors || [],
      leadershipScore: oldState.leadershipScore || 0,
      storyPhase: oldState.storyPhase || 'awakening',
      journal: oldState.journal || [],
      actionsRemaining: oldState.actionsRemaining || 5,
      maxActionsPerDay: oldState.maxActionsPerDay || 5,
      weather: oldState.weather || 'Clear'
    };
    
    console.log("Upgraded game state to version", this.gameVersion);
    this.saveGame();
  }
  
  startGame() {
    return {
      message: "You wake from cryosleep. The world is silent. Your pod is one of few that survived.",
      state: this.gameState
    };
  }
  
  advanceDay() {
    this.gameState.day++;
    this.consumeResources();
    
    // Reset daily actions
    this.resetDailyActions();
    
    // Determine new weather
    this.determineWeather();
    
    // Check for journal entries
    const journalEntry = this.unlockJournalEntry();
    
    // Determine event type based on day progression
    if (this.gameState.day > 5) {
      // After day 5, introduce curveballs
      this.generateCurveball();
    } else {
      this.generateRandomEvent();
    }
    
    // Progress story phase based on day
    this.progressStoryPhase();
    
    this.saveGame();
    
    return {
      message: `Day ${this.gameState.day} begins. Your small community survives another day.`,
      state: this.gameState,
      journal: journalEntry
    };
  }
  
  consumeResources() {
    // Basic resource consumption
    this.gameState.resources.food -= this.gameState.resources.people * 0.5;
    this.gameState.resources.water -= this.gameState.resources.people * 0.3;
    
    // Resource production from buildings
    if (this.gameState.buildings.farms > 0) {
      this.gameState.resources.food += this.gameState.buildings.farms * 1;
    }
    
    if (this.gameState.buildings.cisterns > 0) {
      this.gameState.resources.water += this.gameState.buildings.cisterns * 1.5;
    }
    
    if (this.gameState.buildings.workshops > 0) {
      this.gameState.resources.materials += this.gameState.buildings.workshops * 0.5;
    }
  }
  
  generateRandomEvent() {
    // Random event generation
    const eventChance = Math.random();
    
    if (eventChance > 0.7) {
      const eventType = Math.floor(Math.random() * 5);
      let newEvent = { day: this.gameState.day };
      
      switch(eventType) {
        case 0: // Beneficial weather
          newEvent.type = "weather";
          newEvent.text = "A rainstorm passed through the area.";
          newEvent.effect = "water";
          this.gameState.resources.water += 5;
          break;
        case 1: // Food discovery
          newEvent.type = "discovery";
          newEvent.text = "Found an old seed cache.";
          newEvent.effect = "food";
          this.gameState.resources.food += 3;
          break;
        case 2: // Materials discovery
          newEvent.type = "discovery";
          newEvent.text = "Discovered an abandoned storage facility.";
          newEvent.effect = "materials";
          this.gameState.resources.materials += 4;
          break;
        case 3: // Survivor encounter
          newEvent.type = "encounter";
          newEvent.text = "Met other survivors.";
          newEvent.effect = "people";
          const newPeople = Math.floor(Math.random() * 2) + 1;
          this.gameState.resources.people += newPeople;
          break;
        case 4: // Story element
          newEvent.type = "story";
          newEvent.text = "Found data logs about The Quiet Reset.";
          newEvent.effect = "knowledge";
          
          // Add to discoveries
          this.gameState.discoveries.push({
            id: this.gameState.discoveries.length + 1,
            title: "Pre-Reset Data Fragment",
            content: "The logs mention something called 'Protocol Zero'..."
          });
          break;
      }
      
      this.gameState.events.push(newEvent);
    }
  }
  
  generateCurveball() {
    const curveballChance = Math.random();
    let newEvent = { day: this.gameState.day };
    
    // Higher chance of challenging events
    if (curveballChance > 0.4) {
      const eventType = Math.floor(Math.random() * 6);
      
      switch(eventType) {
        case 0: // Harsh weather
          newEvent.type = "weather";
          newEvent.severity = "negative";
          newEvent.text = "A severe storm damages your settlement.";
          newEvent.effect = "damage";
          
          // Damage random building or resources
          if (this.gameState.buildings.shelters > 0 && Math.random() > 0.5) {
            this.gameState.buildings.shelters -= 1;
            newEvent.text += " Lost 1 shelter.";
          } else {
            const resourceLoss = Math.floor(Math.random() * 3) + 2;
            this.gameState.resources.materials -= resourceLoss;
            if (this.gameState.resources.materials < 0) this.gameState.resources.materials = 0;
            newEvent.text += ` Lost ${resourceLoss} materials.`;
          }
          break;
          
        case 1: // Food contamination
          newEvent.type = "disease";
          newEvent.severity = "negative";
          newEvent.text = "Food supplies have been contaminated.";
          newEvent.effect = "food";
          
          const foodLoss = Math.floor(this.gameState.resources.food * 0.3);
          this.gameState.resources.food -= foodLoss;
          if (this.gameState.resources.food < 0) this.gameState.resources.food = 0;
          newEvent.text += ` Lost ${foodLoss} food.`;
          break;
          
        case 2: // Hostile survivors
          newEvent.type = "encounter";
          newEvent.severity = "challenge";
          newEvent.text = "Hostile survivors demand resources.";
          
          // Leadership challenge - outcome depends on leadership score
          if (this.gameState.leadershipScore > this.gameState.day * 0.5) {
            newEvent.text += " You convinced them to join your settlement instead!";
            const newPeople = Math.floor(Math.random() * 2) + 1;
            this.gameState.resources.people += newPeople;
            this.gameState.leadershipScore += 2;
            
            // Add survivor story
            this.addSurvivor("Former Bandit", "Initially hostile, they were convinced to join your community through your leadership.");
          } else {
            // Resource loss
            const resourceType = Math.random() > 0.5 ? "food" : "materials";
            const loss = Math.floor(this.gameState.resources[resourceType] * 0.2) + 1;
            this.gameState.resources[resourceType] -= loss;
            if (this.gameState.resources[resourceType] < 0) this.gameState.resources[resourceType] = 0;
            newEvent.text += ` They took ${loss} ${resourceType}.`;
          }
          break;
          
        case 3: // Water source drying up
          newEvent.type = "resource";
          newEvent.severity = "negative";
          newEvent.text = "Your water source is drying up.";
          newEvent.effect = "water";
          
          const waterReduction = Math.floor(this.gameState.resources.water * 0.4);
          this.gameState.resources.water -= waterReduction;
          if (this.gameState.resources.water < 0) this.gameState.resources.water = 0;
          newEvent.text += ` Lost ${waterReduction} water.`;
          break;
          
        case 4: // Survivor with special knowledge
          newEvent.type = "opportunity";
          newEvent.severity = "positive";
          
          const specialistType = Math.floor(Math.random() * 4);
          let specialistName, specialistSkill, specialistEffect;
          
          switch(specialistType) {
            case 0:
              specialistName = "Engineer";
              specialistSkill = "construction techniques";
              this.gameState.buildings.workshops += 1;
              specialistEffect = "workshop";
              break;
            case 1:
              specialistName = "Botanist";
              specialistSkill = "sustainable farming";
              this.gameState.buildings.farms += 1;
              specialistEffect = "farm";
              break;
            case 2:
              specialistName = "Hydrologist";
              specialistSkill = "water purification";
              this.gameState.buildings.cisterns += 1;
              specialistEffect = "cistern";
              break;
            case 3:
              specialistName = "Doctor";
              specialistSkill = "medical care";
              this.gameState.leadershipScore += 3;
              specialistEffect = "leadership";
              break;
          }
          
          newEvent.text = `A survivor with ${specialistSkill} knowledge found your settlement.`;
          newEvent.effect = specialistEffect;
          
          // Add survivor story
          this.addSurvivor(specialistName, `Brought valuable ${specialistSkill} to your community. Their expertise has greatly improved your settlement's capabilities.`);
          
          this.gameState.resources.people += 1;
          this.gameState.leadershipScore += 1;
          break;
          
        case 5: // Major discovery
          newEvent.type = "story";
          newEvent.severity = "revelation";
          
          const discoveryIndex = this.gameState.discoveries.length;
          const storyReveals = [
            {title: "Protocol Zero Document", content: "A classified government directive to prepare for environmental collapse."},
            {title: "Corporate Memo", content: "Executives were aware of 'The Quiet Reset' and prepared private bunkers."},
            {title: "Military Transmission", content: "References to 'Operation Sleepwalker' and cryo-preservation programs."},
            {title: "Research Notes", content: "Details on a biological agent designed to put much of the population into stasis."},
            {title: "Survivor's Journal", content: "First-hand account of the days leading up to The Quiet Reset."}
          ];
          
          const revelation = storyReveals[discoveryIndex % storyReveals.length];
          
          // Add to discoveries
          this.gameState.discoveries.push({
            id: discoveryIndex + 1,
            title: revelation.title,
            content: revelation.content,
            day: this.gameState.day
          });
          
          newEvent.text = `You found ${revelation.title}. ${revelation.content}`;
          newEvent.effect = "revelation";
          
          this.gameState.leadershipScore += 2;
          
          // Progress story phase if enough discoveries
          if (this.gameState.discoveries.length >= 3 && this.gameState.storyPhase === 'awakening') {
            this.gameState.storyPhase = 'survival';
          } else if (this.gameState.discoveries.length >= 5 && this.gameState.storyPhase === 'survival') {
            this.gameState.storyPhase = 'expansion';
          } else if (this.gameState.discoveries.length >= 8 && this.gameState.storyPhase === 'expansion') {
            this.gameState.storyPhase = 'revelation';
          }
          break;
      }
    } else {
      // Standard random event with lower probability after day 5
      this.generateRandomEvent();
      return; // Early return as generateRandomEvent already pushes to events
    }
    
    this.gameState.events.push(newEvent);
  }
  
  scavengeResources() {
    const foodFound = Math.floor(Math.random() * 4);
    const waterFound = Math.floor(Math.random() * 5);
    const materialsFound = Math.floor(Math.random() * 3);
    
    this.gameState.resources.food += foodFound;
    this.gameState.resources.water += waterFound;
    this.gameState.resources.materials += materialsFound;
    
    this.saveGame();
    
    return {
      food: foodFound,
      water: waterFound,
      materials: materialsFound
    };
  }
  
  buildStructure(type) {
    const costs = {
      shelter: { materials: 2 },
      farm: { materials: 3 },
      cistern: { materials: 4 },
      workshop: { materials: 5 }
    };
    
    const cost = costs[type];
    if (!cost) return false;
    
    // Check if we have enough resources
    if (this.gameState.resources.materials < cost.materials) {
      return false;
    }
    
    // Deduct cost
    this.gameState.resources.materials -= cost.materials;
    
    // Add building
    switch(type) {
      case 'shelter':
        this.gameState.buildings.shelters++;
        break;
      case 'farm':
        this.gameState.buildings.farms++;
        break;
      case 'cistern':
        this.gameState.buildings.cisterns++;
        break;
      case 'workshop':
        this.gameState.buildings.workshops++;
        break;
    }
    
    this.saveGame();
    return true;
  }
  
  explore() {
    const resultChance = Math.random();
    let result = {};
    
    if (resultChance > 0.7) {
      // Found survivors
      const newPeople = Math.floor(Math.random() * 2) + 1;
      this.gameState.resources.people += newPeople;
      
      // Generate survivor story
      const survivorTypes = ["Former Teacher", "Ex-Military", "Medical Worker", "Engineer", "Farmer", "Child"];
      const survivorStories = [
        "Found hiding in an abandoned building.",
        "Was part of another group that didn't make it.",
        "Has been wandering alone since The Quiet Reset.",
        "Was in cryosleep like you, but woke up earlier.",
        "Survived by staying isolated in a remote cabin."
      ];
      
      for (let i = 0; i < newPeople; i++) {
        const survivorType = survivorTypes[Math.floor(Math.random() * survivorTypes.length)];
        const survivorStory = survivorStories[Math.floor(Math.random() * survivorStories.length)];
        this.addSurvivor(survivorType, survivorStory);
      }
      
      // Leadership bonus for finding survivors
      this.gameState.leadershipScore += newPeople;
      
      result = {
        type: 'survivors',
        amount: newPeople,
        message: `Found ${newPeople} survivor${newPeople > 1 ? 's' : ''}!`
      };
    } else if (resultChance > 0.4) {
      // Found materials
      const materialsFound = Math.floor(Math.random() * 5) + 1;
      this.gameState.resources.materials += materialsFound;
      
      result = {
        type: 'materials',
        amount: materialsFound,
        message: `Found ${materialsFound} materials from an abandoned structure.`
      };
    } else {
      // Nothing special
      result = {
        type: 'nothing',
        message: "Explored the area but found nothing significant."
      };
    }
    
    this.saveGame();
    return result;
  }
  
  addSurvivor(type, backstory) {
    const survivor = {
      id: this.gameState.survivors.length + 1,
      type: type,
      backstory: backstory,
      joinedDay: this.gameState.day,
      skills: []
    };
    
    // Assign skills based on type
    switch(type) {
      case "Former Teacher":
        survivor.skills.push("Education", "Leadership");
        break;
      case "Ex-Military":
        survivor.skills.push("Security", "Discipline");
        break;
      case "Medical Worker":
        survivor.skills.push("Healthcare", "Science");
        break;
      case "Engineer":
        survivor.skills.push("Construction", "Innovation");
        break;
      case "Farmer":
        survivor.skills.push("Agriculture", "Sustainability");
        break;
      case "Child":
        survivor.skills.push("Adaptability", "Future");
        break;
      case "Former Bandit":
        survivor.skills.push("Survival", "Resourcefulness");
        break;
      case "Engineer":
        survivor.skills.push("Construction", "Technology");
        break;
      case "Botanist":
        survivor.skills.push("Agriculture", "Medicine");
        break;
      case "Hydrologist":
        survivor.skills.push("Water Management", "Planning");
        break;
      case "Doctor":
        survivor.skills.push("Medicine", "Leadership");
        break;
    }
    
    this.gameState.survivors.push(survivor);
  }
  
  saveGame() {
    try {
      // Ensure the version is saved with the game state
      this.gameState.version = this.gameVersion;
      localStorage.setItem('reclaimedGameSave', JSON.stringify(this.gameState));
    } catch (e) {
      console.error("Error saving game:", e);
    }
  }
  
  resetGame() {
    localStorage.removeItem('reclaimedGameSave');
    this.gameState = {
      version: this.gameVersion,
      day: 1,
      resources: {
        food: 10,
        water: 15,
        materials: 5,
        people: 3
      },
      buildings: {
        shelters: 1,
        farms: 0,
        cisterns: 0,
        workshops: 0
      },
      events: [],
      discoveries: [],
      survivors: [],
      leadershipScore: 0,
      storyPhase: 'awakening', // awakening, survival, expansion, revelation
      journal: [],
      actionsRemaining: 5,
      maxActionsPerDay: 5,
      weather: 'Clear'
    };
    this.saveGame();
  }

  // Add journal entry functionality 
  unlockJournalEntry() {
    if (this.journalEntries[this.gameState.day]) {
      const entry = this.journalEntries[this.gameState.day];
      entry.day = this.gameState.day; // Add day information
      
      // Add to player's journal
      this.gameState.journal.push(entry);
      
      // Add journal discovery to events log
      const journalEvent = {
        day: this.gameState.day,
        type: "journal",
        text: `Found a journal entry: "${entry.title}" by ${entry.author}.`,
        effect: "journal"
      };
      
      this.gameState.events.push(journalEvent);
      
      return entry;
    }
    
    return null;
  }

  // Handle action limits
  useAction() {
    if (this.gameState.actionsRemaining > 0) {
      this.gameState.actionsRemaining--;
      this.saveGame();
      return true;
    }
    return false;
  }

  // Reset daily actions
  resetDailyActions() {
    this.gameState.actionsRemaining = this.gameState.maxActionsPerDay;
    this.saveGame();
  }

  // Get random character dialogue
  getCharacterDialogue(character, context) {
    if (!this.characters[character] || !this.characters[character].dialogues[context]) {
      return null;
    }
    
    const dialogues = this.characters[character].dialogues[context];
    if (Array.isArray(dialogues)) {
      return dialogues[Math.floor(Math.random() * dialogues.length)];
    }
    
    return dialogues;
  }

  // Determine weather for the day
  determineWeather() {
    const weatherKeys = Object.keys(this.weatherTypes);
    this.gameState.weather = weatherKeys[Math.floor(Math.random() * weatherKeys.length)];
    
    return {
      type: this.gameState.weather,
      description: this.weatherTypes[this.gameState.weather].description,
      effects: this.weatherTypes[this.gameState.weather].effects
    };
  }

  // Progress story phases based on days and discoveries
  progressStoryPhase() {
    // Natural story progression based on days
    if (this.gameState.day >= 5 && this.gameState.storyPhase === 'awakening') {
      this.gameState.storyPhase = 'survival';
    } else if (this.gameState.day >= 12 && this.gameState.storyPhase === 'survival') {
      this.gameState.storyPhase = 'expansion';
    } else if (this.gameState.day >= 20 && this.gameState.storyPhase === 'expansion') {
      this.gameState.storyPhase = 'revelation';
    }
  }

  // Get active quest status
  getActiveQuest() {
    // Find current active quest based on story phase
    switch(this.gameState.storyPhase) {
      case 'awakening':
        return this.quests["awakening"];
      case 'survival':
        return this.quests["silent_streets"];
      case 'expansion':
        return this.quests["distant_smoke"];
      default:
        return null;
    }
  }

  // Complete a quest objective
  completeObjective(objectiveId) {
    const activeQuest = this.getActiveQuest();
    if (!activeQuest) return false;
    
    const objective = activeQuest.objectives.find(obj => obj.id === objectiveId);
    if (objective && !objective.completed) {
      objective.completed = true;
      
      // Log the completion
      const objectiveEvent = {
        day: this.gameState.day,
        type: "objective",
        text: `Completed objective: ${objective.text}`,
        effect: "progress"
      };
      
      this.gameState.events.push(objectiveEvent);
      this.saveGame();
      
      // Check if all objectives are completed
      if (activeQuest.objectives.every(obj => obj.completed)) {
        return this.completeQuest(activeQuest);
      }
      
      return true;
    }
    
    return false;
  }

  // Complete a quest and give rewards
  completeQuest(quest) {
    // Give rewards
    if (quest.rewards.resources) {
      Object.keys(quest.rewards.resources).forEach(resource => {
        this.gameState.resources[resource] += quest.rewards.resources[resource];
      });
    }
    
    // Add journal entry for quest completion
    const questCompletionEntry = {
      title: `Quest Completed: ${quest.title}`,
      author: "Settlement Log",
      text: `Successfully completed ${quest.title}. ${quest.description} The settlement grows stronger.`,
      day: this.gameState.day
    };
    
    this.gameState.journal.push(questCompletionEntry);
    
    // Log the completion
    const questEvent = {
      day: this.gameState.day,
      type: "quest",
      text: `Completed quest: ${quest.title}`,
      effect: "completion"
    };
    
    this.gameState.events.push(questEvent);
    this.gameState.leadershipScore += 3;
    this.saveGame();
    
    return true;
  }

  // Add multiple save slots functionality
  saveGameToSlot(slotNumber) {
    if (slotNumber < 1 || slotNumber > 3) {
      console.error("Invalid save slot number. Must be 1-3.");
      return false;
    }
    
    try {
      const saveKey = `reclaimedGameSave_slot${slotNumber}`;
      const saveDate = new Date().toLocaleString();
      
      // Add metadata to the save
      const saveData = {
        ...this.gameState,
        meta: {
          savedAt: saveDate,
          days: this.gameState.day,
          people: this.gameState.resources.people,
          leadership: this.gameState.leadershipScore
        }
      };
      
      localStorage.setItem(saveKey, JSON.stringify(saveData));
      console.log(`Game saved to slot ${slotNumber}`);
      return true;
    } catch (e) {
      console.error("Error saving game to slot:", e);
      return false;
    }
  }
  
  // Load game from a specific slot
  loadGameFromSlot(slotNumber) {
    if (slotNumber < 1 || slotNumber > 3) {
      console.error("Invalid save slot number. Must be 1-3.");
      return false;
    }
    
    try {
      const saveKey = `reclaimedGameSave_slot${slotNumber}`;
      const savedData = localStorage.getItem(saveKey);
      
      if (!savedData) {
        console.log(`No save found in slot ${slotNumber}`);
        return false;
      }
      
      const parsedState = JSON.parse(savedData);
      
      // Remove metadata before setting game state
      if (parsedState.meta) {
        delete parsedState.meta;
      }
      
      this.gameState = parsedState;
      console.log(`Game loaded from slot ${slotNumber}`);
      return true;
    } catch (e) {
      console.error("Error loading game from slot:", e);
      return false;
    }
  }
  
  // Get information about saves in all slots
  getSaveSlotInfo() {
    const saveInfo = [];
    
    for (let i = 1; i <= 3; i++) {
      const saveKey = `reclaimedGameSave_slot${i}`;
      const savedData = localStorage.getItem(saveKey);
      
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          saveInfo.push({
            slot: i,
            isEmpty: false,
            ...parsed.meta
          });
        } catch (e) {
          saveInfo.push({
            slot: i,
            isEmpty: false,
            error: true,
            savedAt: "Error reading save"
          });
        }
      } else {
        saveInfo.push({
          slot: i,
          isEmpty: true
        });
      }
    }
    
    return saveInfo;
  }
  
  // Delete a save from a specific slot
  deleteSaveInSlot(slotNumber) {
    if (slotNumber < 1 || slotNumber > 3) {
      console.error("Invalid save slot number. Must be 1-3.");
      return false;
    }
    
    try {
      const saveKey = `reclaimedGameSave_slot${slotNumber}`;
      localStorage.removeItem(saveKey);
      console.log(`Save in slot ${slotNumber} deleted`);
      return true;
    } catch (e) {
      console.error("Error deleting save:", e);
      return false;
    }
  }
}