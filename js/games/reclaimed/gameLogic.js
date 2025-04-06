/**
 * Reclaimed Game Logic
 * A post-apocalyptic survival game where players rebuild civilization
 */

class ReclaimedGame {
  constructor() {
    this.gameState = {
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
      storyPhase: 'awakening' // awakening, survival, expansion, revelation
    };
    
    this.init();
  }
  
  init() {
    console.log("Initializing Reclaimed game...");
    // Load saved game if exists
    const savedGame = localStorage.getItem('reclaimedGameSave');
    if (savedGame) {
      try {
        this.gameState = JSON.parse(savedGame);
        console.log("Loaded saved game from day", this.gameState.day);
      } catch (e) {
        console.error("Error loading saved game:", e);
      }
    }
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
    
    // Determine event type based on day progression
    if (this.gameState.day > 5) {
      // After day 5, introduce curveballs
      this.generateCurveball();
    } else {
      this.generateRandomEvent();
    }
    
    this.saveGame();
    
    return {
      message: `Day ${this.gameState.day} begins. Your small community survives another day.`,
      state: this.gameState
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
      localStorage.setItem('reclaimedGameSave', JSON.stringify(this.gameState));
    } catch (e) {
      console.error("Error saving game:", e);
    }
  }
  
  resetGame() {
    localStorage.removeItem('reclaimedGameSave');
    this.gameState = {
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
      storyPhase: 'awakening' // awakening, survival, expansion, revelation
    };
    this.saveGame();
  }
}

// Export for use in the game
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ReclaimedGame;
}