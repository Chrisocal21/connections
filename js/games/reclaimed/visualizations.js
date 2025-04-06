/**
 * Map Generation for Reclaimed
 * Generates a visual representation of the player's settlement and surroundings
 */

class ReclaimedMapGenerator {
  constructor(canvasId, gameState) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.gameState = gameState;
    this.tileSize = 12;
    this.colors = {
      background: '#1a1a1a',
      settlement: '#64D9FF',
      forest: '#3D5E3D',
      water: '#1E3A5F',
      ruins: '#5D4E3D',
      unexplored: '#2A2A2A',
      border: '#404040'
    };
    this.mapData = [];
    this.generateInitialMap();
  }
  
  generateInitialMap() {
    // Create initial map data - 32x32 grid
    this.mapSize = 32;
    this.mapData = [];
    
    // Fill with unexplored territory
    for (let y = 0; y < this.mapSize; y++) {
      this.mapData[y] = [];
      for (let x = 0; x < this.mapSize; x++) {
        this.mapData[y][x] = {
          type: 'unexplored',
          explored: false
        };
      }
    }
    
    // Place settlement in center
    const center = Math.floor(this.mapSize / 2);
    this.mapData[center][center].type = 'settlement';
    this.mapData[center][center].explored = true;
    
    // Generate some initial features around the settlement
    this.revealArea(center, center, 3);
    this.generateFeatures();
  }
  
  revealArea(centerX, centerY, radius) {
    for (let y = centerY - radius; y <= centerY + radius; y++) {
      for (let x = centerX - radius; x <= centerX + radius; x++) {
        if (y >= 0 && y < this.mapSize && x >= 0 && x < this.mapSize) {
          const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
          if (distance <= radius) {
            this.mapData[y][x].explored = true;
          }
        }
      }
    }
  }
  
  generateFeatures() {
    const center = Math.floor(this.mapSize / 2);
    
    // Add water source near settlement
    const waterX = center + (Math.random() > 0.5 ? 2 : -2);
    const waterY = center + (Math.random() > 0.5 ? 2 : -2);
    this.mapData[waterY][waterX].type = 'water';
    
    // Add some forest
    for (let i = 0; i < 30; i++) {
      const x = Math.floor(Math.random() * this.mapSize);
      const y = Math.floor(Math.random() * this.mapSize);
      if (Math.abs(x - center) > 3 || Math.abs(y - center) > 3) {
        this.mapData[y][x].type = 'forest';
      }
    }
    
    // Add ruins (old buildings, etc)
    for (let i = 0; i < 15; i++) {
      const x = Math.floor(Math.random() * this.mapSize);
      const y = Math.floor(Math.random() * this.mapSize);
      if (Math.abs(x - center) > 5 || Math.abs(y - center) > 5) {
        this.mapData[y][x].type = 'ruins';
      }
    }
  }
  
  updateMap(gameState) {
    this.gameState = gameState;
    
    // Expand explored area based on game progression
    const center = Math.floor(this.mapSize / 2);
    const exploreRadius = Math.min(15, 3 + Math.floor(gameState.day / 2));
    this.revealArea(center, center, exploreRadius);
    
    // Add new features based on game state
    if (gameState.day % 3 === 0) {
      this.addFeatureBasedOnDay(gameState.day);
    }
    
    this.render();
  }
  
  addFeatureBasedOnDay(day) {
    const center = Math.floor(this.mapSize / 2);
    
    // Find a position for the new feature
    let x, y, attempts = 0;
    do {
      const distance = 5 + Math.random() * 10;
      const angle = Math.random() * Math.PI * 2;
      x = Math.floor(center + Math.cos(angle) * distance);
      y = Math.floor(center + Math.sin(angle) * distance);
      attempts++;
    } while ((y < 0 || y >= this.mapSize || x < 0 || x >= this.mapSize || 
             this.mapData[y][x].type === 'settlement') && attempts < 50);
    
    if (attempts < 50) {
      // Determine what kind of feature to add
      if (day > 10 && Math.random() < 0.3) {
        // Add a new settlement/outpost
        this.mapData[y][x].type = 'settlement';
        this.mapData[y][x].explored = true;
        this.revealArea(x, y, 2);
      } else if (day > 5 && Math.random() < 0.5) {
        // Add ruins (more likely after day 5)
        this.mapData[y][x].type = 'ruins';
        this.mapData[y][x].explored = true;
      } else {
        // Add forests or water
        this.mapData[y][x].type = Math.random() < 0.7 ? 'forest' : 'water';
        this.mapData[y][x].explored = true;
      }
    }
  }
  
  render() {
    // Clear the canvas
    this.ctx.fillStyle = this.colors.background;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Calculate the offset to center the map
    const offsetX = (this.canvas.width - this.mapSize * this.tileSize) / 2;
    const offsetY = (this.canvas.height - this.mapSize * this.tileSize) / 2;
    
    // Draw the map
    for (let y = 0; y < this.mapSize; y++) {
      for (let x = 0; x < this.mapSize; x++) {
        const tile = this.mapData[y][x];
        
        // Determine tile color
        if (tile.explored) {
          this.ctx.fillStyle = this.colors[tile.type];
        } else {
          this.ctx.fillStyle = this.colors.unexplored;
        }
        
        // Draw the tile
        this.ctx.fillRect(
          offsetX + x * this.tileSize,
          offsetY + y * this.tileSize,
          this.tileSize,
          this.tileSize
        );
        
        // Draw tile border
        this.ctx.strokeStyle = this.colors.border;
        this.ctx.strokeRect(
          offsetX + x * this.tileSize,
          offsetY + y * this.tileSize,
          this.tileSize,
          this.tileSize
        );
      }
    }
    
    // Draw a legend
    this.drawLegend(offsetX, offsetY);
  }
  
  drawLegend(offsetX, offsetY) {
    const legendX = offsetX + this.mapSize * this.tileSize + 10;
    const legendY = offsetY;
    const legendWidth = 120;
    const legendItemHeight = 20;
    
    this.ctx.fillStyle = 'rgba(40, 40, 40, 0.7)';
    this.ctx.fillRect(legendX, legendY, legendWidth, legendItemHeight * 6);
    
    this.ctx.font = '12px Arial';
    this.ctx.fillStyle = '#EEE';
    this.ctx.fillText('Map Legend:', legendX + 5, legendY + 15);
    
    const legendItems = [
      { name: 'Settlement', color: this.colors.settlement },
      { name: 'Forest', color: this.colors.forest },
      { name: 'Water', color: this.colors.water },
      { name: 'Ruins', color: this.colors.ruins },
      { name: 'Unexplored', color: this.colors.unexplored }
    ];
    
    legendItems.forEach((item, index) => {
      // Draw color box
      this.ctx.fillStyle = item.color;
      this.ctx.fillRect(legendX + 5, legendY + 25 + (index * legendItemHeight), 15, 15);
      
      // Draw label
      this.ctx.fillStyle = '#EEE';
      this.ctx.fillText(item.name, legendX + 25, legendY + 37 + (index * legendItemHeight));
    });
  }
}

/**
 * Resource Graphs for Reclaimed
 * Generates line graphs of resource history
 */
class ReclaimedGraphRenderer {
  constructor(canvasId, dataPoints = 14) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.dataPoints = dataPoints;
    this.resourceHistory = {
      days: [],
      food: [],
      water: [],
      materials: [],
      people: []
    };
    this.colors = {
      food: '#9ee493',      // Green
      water: '#64D9FF',     // Blue
      materials: '#f4a259', // Orange
      people: '#ee6c4d'     // Red
    };
  }
  
  addDataPoint(day, resources) {
    // Add the new data point
    this.resourceHistory.days.push(day);
    this.resourceHistory.food.push(resources.food);
    this.resourceHistory.water.push(resources.water);
    this.resourceHistory.materials.push(resources.materials);
    this.resourceHistory.people.push(resources.people);
    
    // Maintain only the last X data points
    if (this.resourceHistory.days.length > this.dataPoints) {
      this.resourceHistory.days.shift();
      this.resourceHistory.food.shift();
      this.resourceHistory.water.shift();
      this.resourceHistory.materials.shift();
      this.resourceHistory.people.shift();
    }
    
    this.render();
  }
  
  render() {
    // Clear the canvas
    this.ctx.fillStyle = '#1a1a1a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // If we don't have enough data yet, show a message
    if (this.resourceHistory.days.length < 2) {
      this.ctx.fillStyle = '#EEE';
      this.ctx.font = '14px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Collecting data...', this.canvas.width / 2, this.canvas.height / 2);
      return;
    }
    
    // Set up graph dimensions
    const padding = 30;
    const graphWidth = this.canvas.width - (padding * 2);
    const graphHeight = this.canvas.height - (padding * 2);
    
    // Draw axes
    this.ctx.strokeStyle = '#555';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(padding, padding);
    this.ctx.lineTo(padding, this.canvas.height - padding);
    this.ctx.lineTo(this.canvas.width - padding, this.canvas.height - padding);
    this.ctx.stroke();
    
    // Find min and max values for scaling
    const allValues = [...this.resourceHistory.food, ...this.resourceHistory.water, 
                       ...this.resourceHistory.materials, ...this.resourceHistory.people];
    const maxValue = Math.max(...allValues) * 1.1; // Add 10% padding
    
    // Label axes
    this.ctx.fillStyle = '#EEE';
    this.ctx.font = '12px Arial';
    this.ctx.textAlign = 'center';
    
    // X-axis labels (days)
    const dayStep = Math.max(1, Math.floor(this.resourceHistory.days.length / 5));
    for (let i = 0; i < this.resourceHistory.days.length; i += dayStep) {
      const x = padding + (i / (this.resourceHistory.days.length - 1)) * graphWidth;
      this.ctx.fillText('Day ' + this.resourceHistory.days[i], x, this.canvas.height - padding + 15);
    }
    
    // Y-axis labels (resource amounts)
    this.ctx.textAlign = 'right';
    const valueStep = maxValue / 5;
    for (let i = 0; i <= 5; i++) {
      const y = this.canvas.height - padding - (i / 5) * graphHeight;
      this.ctx.fillText(Math.round(i * valueStep), padding - 5, y + 4);
    }
    
    // Draw graph title
    this.ctx.textAlign = 'center';
    this.ctx.font = 'bold 14px Arial';
    this.ctx.fillText('Resource History', this.canvas.width / 2, padding - 10);
    
    // Draw lines for each resource
    this.drawResourceLine('food', graphWidth, graphHeight, padding, maxValue);
    this.drawResourceLine('water', graphWidth, graphHeight, padding, maxValue);
    this.drawResourceLine('materials', graphWidth, graphHeight, padding, maxValue);
    this.drawResourceLine('people', graphWidth, graphHeight, padding, maxValue);
    
    // Draw legend
    this.drawLegend();
  }
  
  drawResourceLine(resourceType, graphWidth, graphHeight, padding, maxValue) {
    const data = this.resourceHistory[resourceType];
    
    this.ctx.strokeStyle = this.colors[resourceType];
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    
    for (let i = 0; i < data.length; i++) {
      const x = padding + (i / (data.length - 1)) * graphWidth;
      const y = this.canvas.height - padding - (data[i] / maxValue) * graphHeight;
      
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.stroke();
    
    // Draw points
    for (let i = 0; i < data.length; i++) {
      const x = padding + (i / (data.length - 1)) * graphWidth;
      const y = this.canvas.height - padding - (data[i] / maxValue) * graphHeight;
      
      this.ctx.fillStyle = this.colors[resourceType];
      this.ctx.beginPath();
      this.ctx.arc(x, y, 3, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
  
  drawLegend() {
    const legendX = 50;
    const legendY = 50;
    const legendWidth = 100;
    const legendItemHeight = 20;
    
    this.ctx.fillStyle = 'rgba(40, 40, 40, 0.7)';
    this.ctx.fillRect(legendX, legendY, legendWidth, legendItemHeight * 5);
    
    this.ctx.font = '12px Arial';
    this.ctx.fillStyle = '#EEE';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('Resources:', legendX + 5, legendY + 15);
    
    const legendItems = [
      { name: 'Food', color: this.colors.food },
      { name: 'Water', color: this.colors.water },
      { name: 'Materials', color: this.colors.materials },
      { name: 'People', color: this.colors.people }
    ];
    
    legendItems.forEach((item, index) => {
      // Draw line
      this.ctx.strokeStyle = item.color;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(legendX + 5, legendY + 25 + (index * legendItemHeight) + 7);
      this.ctx.lineTo(legendX + 20, legendY + 25 + (index * legendItemHeight) + 7);
      this.ctx.stroke();
      
      // Draw point
      this.ctx.fillStyle = item.color;
      this.ctx.beginPath();
      this.ctx.arc(legendX + 12, legendY + 25 + (index * legendItemHeight) + 7, 3, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Draw label
      this.ctx.fillStyle = '#EEE';
      this.ctx.fillText(item.name, legendX + 25, legendY + 30 + (index * legendItemHeight));
    });
  }
}