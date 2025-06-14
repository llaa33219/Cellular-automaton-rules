class GlobalGrid {
    constructor(width, height, cellSize) {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.cols = Math.floor(width / cellSize);
        this.rows = Math.floor(height / cellSize);
        
        // Each cell stores: {state: 0-3, rule: 'ruleName', age: 0, strength: 1}
        this.grid = this.createEmptyGrid();
        this.nextGrid = this.createEmptyGrid();
        
        // Special states for some CAs
        this.ants = []; // For Langton's ants
        this.generation = 0;
        
        // Interaction settings
        this.interactionMode = true; // Enable CA interactions
        this.battleMode = false; // Aggressive competition mode
    }

    createEmptyGrid() {
        return Array(this.rows).fill().map(() => 
            Array(this.cols).fill().map(() => ({
                state: 0,
                rule: null,
                age: 0,
                strength: 1 // How resistant this cell is to conversion
            }))
        );
    }

    update() {
        // Clear next grid
        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.cols; j++) {
                this.nextGrid[i][j] = {
                    state: 0,
                    rule: this.grid[i][j].rule,
                    age: 0,
                    strength: this.grid[i][j].strength
                };
            }
        }

        // Update each cell based on its rule
        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.cols; j++) {
                const cell = this.grid[i][j];
                if(cell.rule) {
                    this.updateCell(i, j);
                    
                    // Apply interactions if enabled
                    if(this.interactionMode) {
                        this.applyInteractions(i, j);
                    }
                }
            }
        }

        // Update Langton's ants
        this.updateAnts();

        // Swap grids
        [this.grid, this.nextGrid] = [this.nextGrid, this.grid];
        this.generation++;
    }

    applyInteractions(row, col) {
        const cell = this.grid[row][col];
        const neighbors = this.getNeighborRules(row, col);
        
        // Different interaction rules based on CA types
        switch(cell.rule) {
            case 'forestfire':
                this.applyFireInteractions(row, col, neighbors);
                break;
            case 'wireworld':
                this.applyWireworldInteractions(row, col, neighbors);
                break;
            case 'seeds':
                this.applySeedsInteractions(row, col, neighbors);
                break;
            case 'gameoflife':
                this.applyGameOfLifeInteractions(row, col, neighbors);
                break;
            case 'brain':
                this.applyBrainInteractions(row, col, neighbors);
                break;
            case 'langton':
                this.applyLangtonInteractions(row, col, neighbors);
                break;
            // NEW CA INTERACTION RULES!
            case 'replicator':
                this.applyReplicatorInteractions(row, col, neighbors);
                break;
            case 'highlife':
                this.applyHighLifeInteractions(row, col, neighbors);
                break;
            case 'lifewithoutdeath':
                this.applyLifeWithoutDeathInteractions(row, col, neighbors);
                break;
            case 'coral':
                this.applyCoralInteractions(row, col, neighbors);
                break;
            case 'cyclic':
                this.applyCyclicInteractions(row, col, neighbors);
                break;
            case 'vote':
                this.applyVoteInteractions(row, col, neighbors);
                break;
            // New CA interactions
            case 'gnarl':
                this.applyGnarlInteractions(row, col, neighbors);
                break;
            case 'stains':
                this.applyStainsInteractions(row, col, neighbors);
                break;
            case 'bugs':
                this.applyBugsInteractions(row, col, neighbors);
                break;
            case 'worms':
                this.applyWormsInteractions(row, col, neighbors);
                break;
            case 'generations':
            case 'starwars':
                this.applyGenerationsInteractions(row, col, neighbors);
                break;
            case 'lightning':
                this.applyLightningInteractions(row, col, neighbors);
                break;
            // BIOLOGICAL & SELF-REPLICATING CA
            case 'virus':
                this.applyVirusInteractions(row, col, neighbors);
                break;
            case 'bacteria':
                this.applyBacteriaInteractions(row, col, neighbors);
                break;
            case 'mitosis':
                this.applyMitosisInteractions(row, col, neighbors);
                break;
            case 'cancer':
                this.applyCancerInteractions(row, col, neighbors);
                break;
            case 'slimemold':
                this.applySlimeMoldInteractions(row, col, neighbors);
                break;
            case 'antcolony':
                this.applyAntColonyInteractions(row, col, neighbors);
                break;
            case 'flocking':
                this.applyFlockingInteractions(row, col, neighbors);
                break;
            case 'schooling':
                this.applySchoolingInteractions(row, col, neighbors);
                break;
            case 'mycelium':
                this.applyMyceliumInteractions(row, col, neighbors);
                break;
            case 'evolution':
                this.applyEvolutionInteractions(row, col, neighbors);
                break;
            case 'dna':
                this.applyDNACell(row, col, neighbors);
                break;
            case 'immune':
                this.applyImmuneCell(row, col, neighbors);
                break;
            case 'neuron':
                this.applyNeuronCell(row, col, neighbors);
                break;
            case 'roots':
                this.applyRootsCell(row, col, neighbors);
                break;
            case 'algae':
                this.applyAlgaeCell(row, col, neighbors);
                break;
        }
    }

    applyFireInteractions(row, col, neighbors) {
        const cell = this.grid[row][col];
        
        // Fire spreads to neighboring CAs!
        if(cell.state === 2) { // If burning
            for(let i = -1; i <= 1; i++) {
                for(let j = -1; j <= 1; j++) {
                    if(i === 0 && j === 0) continue;
                    
                    const newRow = (row + i + this.rows) % this.rows;
                    const newCol = (col + j + this.cols) % this.cols;
                    const neighbor = this.grid[newRow][newCol];
                    
                    if(neighbor.rule && neighbor.rule !== 'forestfire' && neighbor.state > 0) {
                        // Convert neighboring CA cells to burning trees
                        if(Math.random() < 0.3 / neighbor.strength) {
                            this.nextGrid[newRow][newCol] = {
                                state: 2, 
                                rule: 'forestfire', 
                                age: 0, 
                                strength: 0.5
                            };
                        }
                    }
                }
            }
        }
    }

    applyWireworldInteractions(row, col, neighbors) {
        const cell = this.grid[row][col];
        
        // Electron heads can "zap" neighboring CAs
        if(cell.state === 2) { // Electron head
            for(let i = -1; i <= 1; i++) {
                for(let j = -1; j <= 1; j++) {
                    if(i === 0 && j === 0) continue;
                    
                    const newRow = (row + i + this.rows) % this.rows;
                    const newCol = (col + j + this.cols) % this.cols;
                    const neighbor = this.grid[newRow][newCol];
                    
                    if(neighbor.rule && neighbor.rule !== 'wireworld' && neighbor.state > 0) {
                        // Convert to copper wire
                        if(Math.random() < 0.2 / neighbor.strength) {
                            this.nextGrid[newRow][newCol] = {
                                state: 1, 
                                rule: 'wireworld', 
                                age: 0, 
                                strength: 1
                            };
                        }
                    }
                }
            }
        }
    }

    applySeedsInteractions(row, col, neighbors) {
        const cell = this.grid[row][col];
        
        // Seeds explode and take over neighboring areas
        if(cell.state === 1) {
            const alienNeighbors = neighbors.filter(n => n.rule !== 'seeds' && n.rule !== null).length;
            
            if(alienNeighbors > 0 && Math.random() < 0.15) {
                // Explosive expansion!
                for(let i = -2; i <= 2; i++) {
                    for(let j = -2; j <= 2; j++) {
                        if(i === 0 && j === 0) continue;
                        
                        const newRow = (row + i + this.rows) % this.rows;
                        const newCol = (col + j + this.cols) % this.cols;
                        const neighbor = this.grid[newRow][newCol];
                        
                        if(neighbor.rule && neighbor.rule !== 'seeds') {
                            if(Math.random() < 0.1 / neighbor.strength) {
                                this.nextGrid[newRow][newCol] = {
                                    state: 1, 
                                    rule: 'seeds', 
                                    age: 0, 
                                    strength: 0.8
                                };
                            }
                        }
                    }
                }
            }
        }
    }

    applyGameOfLifeInteractions(row, col, neighbors) {
        const cell = this.grid[row][col];
        
        // Game of Life slowly assimilates stable patterns
        if(cell.state === 1 && cell.age > 10) {
            const stableNeighbors = neighbors.filter(n => 
                n.rule && n.rule !== 'gameoflife' && n.state > 0 && n.age > 5
            );
            
            if(stableNeighbors.length >= 2) {
                // Slow assimilation
                for(let i = -1; i <= 1; i++) {
                    for(let j = -1; j <= 1; j++) {
                        if(i === 0 && j === 0) continue;
                        
                        const newRow = (row + i + this.rows) % this.rows;
                        const newCol = (col + j + this.cols) % this.cols;
                        const neighbor = this.grid[newRow][newCol];
                        
                        if(neighbor.rule && neighbor.rule !== 'gameoflife' && neighbor.state > 0) {
                            if(Math.random() < 0.05 / neighbor.strength) {
                                this.nextGrid[newRow][newCol] = {
                                    state: 1, 
                                    rule: 'gameoflife', 
                                    age: 0, 
                                    strength: 1.2
                                };
                            }
                        }
                    }
                }
            }
        }
    }

    applyBrainInteractions(row, col, neighbors) {
        const cell = this.grid[row][col];
        
        // Brian's Brain creates chaotic borders
        if(cell.state === 1) { // Firing state
            const alienNeighbors = neighbors.filter(n => n.rule && n.rule !== 'brain');
            
            if(alienNeighbors.length > 0) {
                // Create chaos at borders
                for(let i = -1; i <= 1; i++) {
                    for(let j = -1; j <= 1; j++) {
                        if(i === 0 && j === 0) continue;
                        
                        const newRow = (row + i + this.rows) % this.rows;
                        const newCol = (col + j + this.cols) % this.cols;
                        const neighbor = this.grid[newRow][newCol];
                        
                        if(neighbor.rule && neighbor.rule !== 'brain') {
                            if(Math.random() < 0.1 / neighbor.strength) {
                                this.nextGrid[newRow][newCol] = {
                                    state: Math.random() < 0.5 ? 1 : 2, 
                                    rule: 'brain', 
                                    age: 0, 
                                    strength: 0.7
                                };
                            }
                        }
                    }
                }
            }
        }
    }

    applyLangtonInteractions(row, col, neighbors) {
        // Langton's ants create "highways" through other CAs
        const alienNeighbors = neighbors.filter(n => n.rule && n.rule !== 'langton');
        
        if(alienNeighbors.length > 0) {
            // Ants can tunnel through other CAs
            if(Math.random() < 0.3) {
                this.nextGrid[row][col] = {
                    state: 1, 
                    rule: 'langton', 
                    age: 0, 
                    strength: 1.5
                };
            }
        }
    }

    // NEW INTERACTION METHODS FOR NEW CAs!

    applyReplicatorInteractions(row, col, neighbors) {
        const cell = this.grid[row][col];
        
        // Replicator is EXTREMELY aggressive - it copies itself to any neighbor!
        if(cell.state === 1) {
            for(let i = -1; i <= 1; i++) {
                for(let j = -1; j <= 1; j++) {
                    if(i === 0 && j === 0) continue;
                    
                    const newRow = (row + i + this.rows) % this.rows;
                    const newCol = (col + j + this.cols) % this.cols;
                    const neighbor = this.grid[newRow][newCol];
                    
                    if(neighbor.rule && neighbor.rule !== 'replicator') {
                        // Replicator spreads aggressively!
                        if(Math.random() < 0.4 / neighbor.strength) {
                            this.nextGrid[newRow][newCol] = {
                                state: 1, 
                                rule: 'replicator', 
                                age: 0, 
                                strength: 2 // Very strong
                            };
                        }
                    }
                }
            }
        }
    }

    applyHighLifeInteractions(row, col, neighbors) {
        const cell = this.grid[row][col];
        
        // HighLife creates replicators that spread to neighboring CAs
        if(cell.state === 1 && cell.age > 5) {
            const alienNeighbors = neighbors.filter(n => n.rule && n.rule !== 'highlife');
            
            if(alienNeighbors.length >= 2) {
                // Create replicator patterns in neighboring CAs
                for(let i = -1; i <= 1; i++) {
                    for(let j = -1; j <= 1; j++) {
                        if(i === 0 && j === 0) continue;
                        
                        const newRow = (row + i + this.rows) % this.rows;
                        const newCol = (col + j + this.cols) % this.cols;
                        const neighbor = this.grid[newRow][newCol];
                        
                        if(neighbor.rule && neighbor.rule !== 'highlife') {
                            if(Math.random() < 0.1 / neighbor.strength) {
                                this.nextGrid[newRow][newCol] = {
                                    state: 1, 
                                    rule: 'highlife', 
                                    age: 0, 
                                    strength: 1.3
                                };
                            }
                        }
                    }
                }
            }
        }
    }

    applyLifeWithoutDeathInteractions(row, col, neighbors) {
        const cell = this.grid[row][col];
        
        // Life without Death spreads slowly but persistently
        if(cell.state === 1) {
            const alienNeighbors = neighbors.filter(n => n.rule && n.rule !== 'lifewithoutdeath');
            
            if(alienNeighbors.length > 0) {
                // Slow but unstoppable expansion
                for(let i = -1; i <= 1; i++) {
                    for(let j = -1; j <= 1; j++) {
                        if(i === 0 && j === 0) continue;
                        
                        const newRow = (row + i + this.rows) % this.rows;
                        const newCol = (col + j + this.cols) % this.cols;
                        const neighbor = this.grid[newRow][newCol];
                        
                        if(neighbor.rule && neighbor.rule !== 'lifewithoutdeath') {
                            if(Math.random() < 0.02 / neighbor.strength) {
                                this.nextGrid[newRow][newCol] = {
                                    state: 1, 
                                    rule: 'lifewithoutdeath', 
                                    age: 0, 
                                    strength: 2 // Very resistant once converted
                                };
                            }
                        }
                    }
                }
            }
        }
    }

    applyCoralInteractions(row, col, neighbors) {
        const cell = this.grid[row][col];
        
        // Coral grows by encrusting other CAs
        if(cell.state === 1) {
            for(let i = -1; i <= 1; i++) {
                for(let j = -1; j <= 1; j++) {
                    if(i === 0 && j === 0) continue;
                    
                    const newRow = (row + i + this.rows) % this.rows;
                    const newCol = (col + j + this.cols) % this.cols;
                    const neighbor = this.grid[newRow][newCol];
                    
                    if(neighbor.rule && neighbor.rule !== 'coral' && neighbor.state > 0) {
                        // Coral grows over other CAs slowly
                        if(Math.random() < 0.05 / neighbor.strength) {
                            this.nextGrid[newRow][newCol] = {
                                state: 1, 
                                rule: 'coral', 
                                age: 0, 
                                strength: 1.5
                            };
                        }
                    }
                }
            }
        }
    }

    applyCyclicInteractions(row, col, neighbors) {
        const cell = this.grid[row][col];
        
        // Cyclic CA creates colorful wave fronts that convert neighbors
        const alienNeighbors = neighbors.filter(n => n.rule && n.rule !== 'cyclic');
        
        if(alienNeighbors.length > 0) {
            // Convert neighbors to cyclic waves
            for(let i = -1; i <= 1; i++) {
                for(let j = -1; j <= 1; j++) {
                    if(i === 0 && j === 0) continue;
                    
                    const newRow = (row + i + this.rows) % this.rows;
                    const newCol = (col + j + this.cols) % this.cols;
                    const neighbor = this.grid[newRow][newCol];
                    
                    if(neighbor.rule && neighbor.rule !== 'cyclic') {
                        if(Math.random() < 0.08 / neighbor.strength) {
                            this.nextGrid[newRow][newCol] = {
                                state: (cell.state + 1) % 4, // Next cyclic state
                                rule: 'cyclic', 
                                age: 0, 
                                strength: 1
                            };
                        }
                    }
                }
            }
        }
    }

    applyVoteInteractions(row, col, neighbors) {
        const cell = this.grid[row][col];
        
        // Vote CA democratically converts neighbors based on majority
        if(cell.state === 1) {
            const voteNeighbors = neighbors.filter(n => n.rule === 'vote' && n.state === 1);
            
            // If there's a strong majority of Vote CA neighbors
            if(voteNeighbors.length >= 3) {
                for(let i = -1; i <= 1; i++) {
                    for(let j = -1; j <= 1; j++) {
                        if(i === 0 && j === 0) continue;
                        
                        const newRow = (row + i + this.rows) % this.rows;
                        const newCol = (col + j + this.cols) % this.cols;
                        const neighbor = this.grid[newRow][newCol];
                        
                        if(neighbor.rule && neighbor.rule !== 'vote') {
                            // Democratic conversion
                            if(Math.random() < 0.15 / neighbor.strength) {
                                this.nextGrid[newRow][newCol] = {
                                    state: 1, 
                                    rule: 'vote', 
                                    age: 0, 
                                    strength: 1
                                };
                            }
                        }
                    }
                }
            }
        }
    }

    applyGnarlInteractions(row, col, neighbors) {
        const cell = this.grid[row][col];
        
        // Gnarl is a chaotic growth CA
        if(cell.state === 1) {
            // Survive with exactly 1 neighbor
            this.nextGrid[row][col].state = neighbors === 1 ? 1 : 0;
        } else {
            // Birth with exactly 1 neighbor
            this.nextGrid[row][col].state = neighbors === 1 ? 1 : 0;
        }
        this.nextGrid[row][col].rule = 'gnarl';
    }

    applyStainsInteractions(row, col, neighbors) {
        const cell = this.grid[row][col];
        
        // Stains spread slowly
        if(cell.state === 1) {
            // Survive with 1,2,3 neighbors
            this.nextGrid[row][col].state = [1,2,3].includes(neighbors) ? 1 : 0;
        } else {
            // Birth with 1,2,3 neighbors
            this.nextGrid[row][col].state = [1,2,3].includes(neighbors) ? 1 : 0;
        }
        this.nextGrid[row][col].rule = 'stains';
    }

    applyBugsInteractions(row, col, neighbors) {
        const cell = this.grid[row][col];
        
        // Bugs move randomly
        if(cell.state === 1) {
            // Survive with 1,5,6,7,8 neighbors
            this.nextGrid[row][col].state = [1,5,6,7,8].includes(neighbors) ? 1 : 0;
        } else {
            // Birth with 3,5,6,7 neighbors
            this.nextGrid[row][col].state = [3,5,6,7].includes(neighbors) ? 1 : 0;
        }
        this.nextGrid[row][col].rule = 'bugs';
    }

    applyWormsInteractions(row, col, neighbors) {
        const cell = this.grid[row][col];
        
        // Worms move in a straight line
        if(cell.state === 1) {
            // Survive with 2,3 neighbors
            this.nextGrid[row][col].state = [2,3].includes(neighbors) ? 1 : 0;
        } else {
            // Birth with 3,6,7 neighbors
            this.nextGrid[row][col].state = [3,6,7].includes(neighbors) ? 1 : 0;
        }
        this.nextGrid[row][col].rule = 'worms';
    }

    applyGenerationsInteractions(row, col, neighbors) {
        const cell = this.grid[row][col];
        
        // Generations CA evolves based on the number of neighbors
        if(cell.state === 0 && neighbors === 2) {
            // Birth
            this.nextGrid[row][col].state = 1;
        } else if(cell.state === 1) {
            // Age to dying state
            this.nextGrid[row][col].state = 2;
        } else if(cell.state === 2) {
            // Die
            this.nextGrid[row][col].state = 0;
        }
        this.nextGrid[row][col].rule = 'generations';
    }

    applyLightningInteractions(row, col, neighbors) {
        const cell = this.grid[row][col];
        
        // Lightning bolt generation
        if(this.generation % 30 === 0 && Math.random() < 0.001) {
            // Start new lightning bolt
            this.nextGrid[row][col].state = 4; // Bright flash
        } else if(cell.state > 0) {
            // Lightning propagation
            this.nextGrid[row][col].state = Math.max(0, cell.state - 1);
            
            // Spread to neighbors
            if(cell.state === 4 && Math.random() < 0.3) {
                const directions = [{dx: 0, dy: 1}, {dx: 1, dy: 1}, {dx: -1, dy: 1}];
                const dir = directions[Math.floor(Math.random() * directions.length)];
                const newRow = (row + dir.dy + this.rows) % this.rows;
                const newCol = (col + dir.dx + this.cols) % this.cols;
                
                if(this.grid[newRow][newCol].state === 0) {
                    this.nextGrid[newRow][newCol].state = 3;
                    this.nextGrid[newRow][newCol].rule = 'lightning';
                }
            }
        }
        this.nextGrid[row][col].rule = 'lightning';
    }

    // BIOLOGICAL & SELF-REPLICATING CA
    applyVirusInteractions(row, col, neighbors) {
        const cell = this.grid[row][col];
        
        // Virus spreads to neighboring CAs
        if(cell.state === 1) {
            for(let i = -1; i <= 1; i++) {
                for(let j = -1; j <= 1; j++) {
                    if(i === 0 && j === 0) continue;
                    
                    const newRow = (row + i + this.rows) % this.rows;
                    const newCol = (col + j + this.cols) % this.cols;
                    const neighbor = this.grid[newRow][newCol];
                    
                    if(neighbor.rule && neighbor.rule !== 'virus') {
                        // Virus spreads to neighboring cells
                        if(Math.random() < 0.1 / neighbor.strength) {
                            this.nextGrid[newRow][newCol] = {
                                state: 1, 
                                rule: 'virus', 
                                age: 0, 
                                strength: 0.7
                            };
                        }
                    }
                }
            }
        }
    }

    applyBacteriaInteractions(row, col, neighbors) {
        const cell = this.grid[row][col];
        
        // Bacteria spreads to neighboring CAs
        if(cell.state === 1) {
            for(let i = -1; i <= 1; i++) {
                for(let j = -1; j <= 1; j++) {
                    if(i === 0 && j === 0) continue;
                    
                    const newRow = (row + i + this.rows) % this.rows;
                    const newCol = (col + j + this.cols) % this.cols;
                    const neighbor = this.grid[newRow][newCol];
                    
                    if(neighbor.rule && neighbor.rule !== 'bacteria') {
                        // Bacteria spreads to neighboring cells
                        if(Math.random() < 0.1 / neighbor.strength) {
                            this.nextGrid[newRow][newCol] = {
                                state: 1, 
                                rule: 'bacteria', 
                                age: 0, 
                                strength: 0.7
                            };
                        }
                    }
                }
            }
        }
    }

    applyMitosisInteractions(row, col, neighbors) {
        const cell = this.grid[row][col];
        
        // Mitosis spreads to neighboring CAs
        if(cell.state === 1) {
            for(let i = -1; i <= 1; i++) {
                for(let j = -1; j <= 1; j++) {
                    if(i === 0 && j === 0) continue;
                    
                    const newRow = (row + i + this.rows) % this.rows;
                    const newCol = (col + j + this.cols) % this.cols;
                    const neighbor = this.grid[newRow][newCol];
                    
                    if(neighbor.rule && neighbor.rule !== 'mitosis') {
                        // Mitosis spreads to neighboring cells
                        if(Math.random() < 0.1 / neighbor.strength) {
                            this.nextGrid[newRow][newCol] = {
                                state: 1, 
                                rule: 'mitosis', 
                                age: 0, 
                                strength: 0.7
                            };
                        }
                    }
                }
            }
        }
    }

    applyCancerInteractions(row, col, neighbors) {
        const cell = this.grid[row][col];
        
        // Cancer spreads to neighboring CAs
        if(cell.state === 1) {
            for(let i = -1; i <= 1; i++) {
                for(let j = -1; j <= 1; j++) {
                    if(i === 0 && j === 0) continue;
                    
                    const newRow = (row + i + this.rows) % this.rows;
                    const newCol = (col + j + this.cols) % this.cols;
                    const neighbor = this.grid[newRow][newCol];
                    
                    if(neighbor.rule && neighbor.rule !== 'cancer') {
                        // Cancer spreads to neighboring cells
                        if(Math.random() < 0.1 / neighbor.strength) {
                            this.nextGrid[newRow][newCol] = {
                                state: 1, 
                                rule: 'cancer', 
                                age: 0, 
                                strength: 0.7
                            };
                        }
                    }
                }
            }
        }
    }

    applySlimeMoldInteractions(row, col, neighbors) {
        const cell = this.grid[row][col];
        
        // Slime mold spreads to neighboring CAs
        if(cell.state === 1) {
            for(let i = -1; i <= 1; i++) {
                for(let j = -1; j <= 1; j++) {
                    if(i === 0 && j === 0) continue;
                    
                    const newRow = (row + i + this.rows) % this.rows;
                    const newCol = (col + j + this.cols) % this.cols;
                    const neighbor = this.grid[newRow][newCol];
                    
                    if(neighbor.rule && neighbor.rule !== 'slimemold') {
                        // Slime mold spreads to neighboring cells
                        if(Math.random() < 0.1 / neighbor.strength) {
                            this.nextGrid[newRow][newCol] = {
                                state: 1, 
                                rule: 'slimemold', 
                                age: 0, 
                                strength: 0.7
                            };
                        }
                    }
                }
            }
        }
    }

    applyAntColonyInteractions(row, col, neighbors) {
        const cell = this.grid[row][col];
        
        // Ant colony spreads to neighboring CAs
        if(cell.state === 1) {
            for(let i = -1; i <= 1; i++) {
                for(let j = -1; j <= 1; j++) {
                    if(i === 0 && j === 0) continue;
                    
                    const newRow = (row + i + this.rows) % this.rows;
                    const newCol = (col + j + this.cols) % this.cols;
                    const neighbor = this.grid[newRow][newCol];
                    
                    if(neighbor.rule && neighbor.rule !== 'antcolony') {
                        // Ant colony spreads to neighboring cells
                        if(Math.random() < 0.1 / neighbor.strength) {
                            this.nextGrid[newRow][newCol] = {
                                state: 1, 
                                rule: 'antcolony', 
                                age: 0, 
                                strength: 0.7
                            };
                        }
                    }
                }
            }
        }
    }

    applyFlockingInteractions(row, col, neighbors) {
        const cell = this.grid[row][col];
        
        // Flocking behavior
        if(cell.state === 1) {
            // Survive with 2,3 neighbors
            this.nextGrid[row][col].state = [2,3].includes(neighbors) ? 1 : 0;
        } else {
            // Birth with 3,4 neighbors
            this.nextGrid[row][col].state = [3,4].includes(neighbors) ? 1 : 0;
        }
        this.nextGrid[row][col].rule = 'flocking';
    }

    applySchoolingInteractions(row, col, neighbors) {
        const cell = this.grid[row][col];
        
        // Schooling behavior
        if(cell.state === 1) {
            // Survive with 2,3 neighbors
            this.nextGrid[row][col].state = [2,3].includes(neighbors) ? 1 : 0;
        } else {
            // Birth with 3,4 neighbors
            this.nextGrid[row][col].state = [3,4].includes(neighbors) ? 1 : 0;
        }
        this.nextGrid[row][col].rule = 'schooling';
    }

    applyMyceliumInteractions(row, col, neighbors) {
        const cell = this.grid[row][col];
        
        // Mycelium spreads to neighboring CAs
        if(cell.state === 1) {
            for(let i = -1; i <= 1; i++) {
                for(let j = -1; j <= 1; j++) {
                    if(i === 0 && j === 0) continue;
                    
                    const newRow = (row + i + this.rows) % this.rows;
                    const newCol = (col + j + this.cols) % this.cols;
                    const neighbor = this.grid[newRow][newCol];
                    
                    if(neighbor.rule && neighbor.rule !== 'mycelium') {
                        // Mycelium spreads to neighboring cells
                        if(Math.random() < 0.1 / neighbor.strength) {
                            this.nextGrid[newRow][newCol] = {
                                state: 1, 
                                rule: 'mycelium', 
                                age: 0, 
                                strength: 0.7
                            };
                        }
                    }
                }
            }
        }
    }

    applyEvolutionInteractions(row, col, neighbors) {
        const cell = this.grid[row][col];
        
        // Evolution spreads to neighboring CAs
        if(cell.state === 1) {
            for(let i = -1; i <= 1; i++) {
                for(let j = -1; j <= 1; j++) {
                    if(i === 0 && j === 0) continue;
                    
                    const newRow = (row + i + this.rows) % this.rows;
                    const newCol = (col + j + this.cols) % this.cols;
                    const neighbor = this.grid[newRow][newCol];
                    
                    if(neighbor.rule && neighbor.rule !== 'evolution') {
                        // Evolution spreads to neighboring cells
                        if(Math.random() < 0.1 / neighbor.strength) {
                            this.nextGrid[newRow][newCol] = {
                                state: 1, 
                                rule: 'evolution', 
                                age: 0, 
                                strength: 0.7
                            };
                        }
                    }
                }
            }
        }
    }

    applyDNACell(row, col, neighbors) {
        const cell = this.grid[row][col];
        
        // DNA spreads to neighboring CAs
        if(cell.state === 1) {
            for(let i = -1; i <= 1; i++) {
                for(let j = -1; j <= 1; j++) {
                    if(i === 0 && j === 0) continue;
                    
                    const newRow = (row + i + this.rows) % this.rows;
                    const newCol = (col + j + this.cols) % this.cols;
                    const neighbor = this.grid[newRow][newCol];
                    
                    if(neighbor.rule && neighbor.rule !== 'dna') {
                        // DNA spreads to neighboring cells
                        if(Math.random() < 0.1 / neighbor.strength) {
                            this.nextGrid[newRow][newCol] = {
                                state: 1, 
                                rule: 'dna', 
                                age: 0, 
                                strength: 0.7
                            };
                        }
                    }
                }
            }
        }
    }

    applyImmuneCell(row, col, neighbors) {
        const cell = this.grid[row][col];
        
        // Immune system spreads to neighboring CAs
        if(cell.state === 1) {
            for(let i = -1; i <= 1; i++) {
                for(let j = -1; j <= 1; j++) {
                    if(i === 0 && j === 0) continue;
                    
                    const newRow = (row + i + this.rows) % this.rows;
                    const newCol = (col + j + this.cols) % this.cols;
                    const neighbor = this.grid[newRow][newCol];
                    
                    if(neighbor.rule && neighbor.rule !== 'immune') {
                        // Immune system spreads to neighboring cells
                        if(Math.random() < 0.1 / neighbor.strength) {
                            this.nextGrid[newRow][newCol] = {
                                state: 1, 
                                rule: 'immune', 
                                age: 0, 
                                strength: 0.7
                            };
                        }
                    }
                }
            }
        }
    }

    applyNeuronCell(row, col, neighbors) {
        const cell = this.grid[row][col];
        
        // Neuron spreads to neighboring CAs
        if(cell.state === 1) {
            for(let i = -1; i <= 1; i++) {
                for(let j = -1; j <= 1; j++) {
                    if(i === 0 && j === 0) continue;
                    
                    const newRow = (row + i + this.rows) % this.rows;
                    const newCol = (col + j + this.cols) % this.cols;
                    const neighbor = this.grid[newRow][newCol];
                    
                    if(neighbor.rule && neighbor.rule !== 'neuron') {
                        // Neuron spreads to neighboring cells
                        if(Math.random() < 0.1 / neighbor.strength) {
                            this.nextGrid[newRow][newCol] = {
                                state: 1, 
                                rule: 'neuron', 
                                age: 0, 
                                strength: 0.7
                            };
                        }
                    }
                }
            }
        }
    }

    applyRootsCell(row, col, neighbors) {
        const cell = this.grid[row][col];
        
        // Roots spread to neighboring CAs
        if(cell.state === 1) {
            for(let i = -1; i <= 1; i++) {
                for(let j = -1; j <= 1; j++) {
                    if(i === 0 && j === 0) continue;
                    
                    const newRow = (row + i + this.rows) % this.rows;
                    const newCol = (col + j + this.cols) % this.cols;
                    const neighbor = this.grid[newRow][newCol];
                    
                    if(neighbor.rule && neighbor.rule !== 'roots') {
                        // Roots spread to neighboring cells
                        if(Math.random() < 0.1 / neighbor.strength) {
                            this.nextGrid[newRow][newCol] = {
                                state: 1, 
                                rule: 'roots', 
                                age: 0, 
                                strength: 0.7
                            };
                        }
                    }
                }
            }
        }
    }

    applyAlgaeCell(row, col, neighbors) {
        const cell = this.grid[row][col];
        
        // Algae spreads to neighboring CAs
        if(cell.state === 1) {
            for(let i = -1; i <= 1; i++) {
                for(let j = -1; j <= 1; j++) {
                    if(i === 0 && j === 0) continue;
                    
                    const newRow = (row + i + this.rows) % this.rows;
                    const newCol = (col + j + this.cols) % this.cols;
                    const neighbor = this.grid[newRow][newCol];
                    
                    if(neighbor.rule && neighbor.rule !== 'algae') {
                        // Algae spreads to neighboring cells
                        if(Math.random() < 0.1 / neighbor.strength) {
                            this.nextGrid[newRow][newCol] = {
                                state: 1, 
                                rule: 'algae', 
                                age: 0, 
                                strength: 0.7
                            };
                        }
                    }
                }
            }
        }
    }

    getNeighborRules(row, col) {
        const neighbors = [];
        for(let i = -1; i <= 1; i++) {
            for(let j = -1; j <= 1; j++) {
                if(i === 0 && j === 0) continue;
                
                const newRow = (row + i + this.rows) % this.rows;
                const newCol = (col + j + this.cols) % this.cols;
                neighbors.push(this.grid[newRow][newCol]);
            }
        }
        return neighbors;
    }

    updateCell(row, col) {
        const cell = this.grid[row][col];
        const rule = cell.rule;

        // Increase age
        this.nextGrid[row][col].age = cell.age + 1;

        switch(rule) {
            case 'gameoflife':
                this.updateGameOfLifeCell(row, col);
                break;
            case 'rule30':
                this.updateElementaryCACell(row, col, 30);
                break;
            case 'rule110':
                this.updateElementaryCACell(row, col, 110);
                break;
            case 'rule90':
                this.updateElementaryCACell(row, col, 90);
                break;
            case 'brain':
                this.updateBriansBrainCell(row, col);
                break;
            case 'seeds':
                this.updateSeedsCell(row, col);
                break;
            case 'wireworld':
                this.updateWireworldCell(row, col);
                break;
            case 'forestfire':
                this.updateForestFireCell(row, col);
                break;
            case 'maze':
                this.updateMazeCell(row, col);
                break;
            // New exciting CA rules!
            case 'highlife':
                this.updateHighLifeCell(row, col);
                break;
            case 'daynight':
                this.updateDayNightCell(row, col);
                break;
            case 'replicator':
                this.updateReplicatorCell(row, col);
                break;
            case 'lifewithoutdeath':
                this.updateLifeWithoutDeathCell(row, col);
                break;
            case 'twobytwo':
                this.updateTwoByTwoCell(row, col);
                break;
            case 'morley':
                this.updateMorleyCell(row, col);
                break;
            case 'vote':
                this.updateVoteCell(row, col);
                break;
            case 'coral':
                this.updateCoralCell(row, col);
                break;
            case 'cyclic':
                this.updateCyclicCell(row, col);
                break;
            case 'anneal':
                this.updateAnnealCell(row, col);
                break;
            // More Elementary CA rules
            case 'rule54':
                this.updateElementaryCACell(row, col, 54);
                break;
            case 'rule60':
                this.updateElementaryCACell(row, col, 60);
                break;
            case 'rule102':
                this.updateElementaryCACell(row, col, 102);
                break;
            case 'rule126':
                this.updateElementaryCACell(row, col, 126);
                break;
            case 'rule150':
                this.updateElementaryCACell(row, col, 150);
                break;
            case 'rule184':
                this.updateElementaryCACell(row, col, 184);
                break;
            case 'rule190':
                this.updateElementaryCACell(row, col, 190);
                break;
            case 'rule250':
                this.updateElementaryCACell(row, col, 250);
                break;
            // Generations family
            case 'generations':
                this.updateGenerationsCell(row, col);
                break;
            case 'starwars':
                this.updateStarWarsCell(row, col);
                break;
            // More Life-like CA
            case 'diamoeba':
                this.updateDiamoebaCell(row, col);
                break;
            case 'gnarl':
                this.updateGnarlCell(row, col);
                break;
            case 'dotlife':
                this.updateDotLifeCell(row, col);
                break;
            case 'pedestrian':
                this.updatePedestrianCell(row, col);
                break;
            case 'stains':
                this.updateStainsCell(row, col);
                break;
            case 'coagulations':
                this.updateCoagulationsCell(row, col);
                break;
            case 'worms':
                this.updateWormsCell(row, col);
                break;
            case 'bugs':
                this.updateBugsCell(row, col);
                break;
            // CREATIVE & UNIQUE CA RULES
            case 'bbm':
                this.updateBBMCell(row, col);
                break;
            case 'hppgas':
                this.updateHPPGasCell(row, col);
                break;
            case 'critters':
                this.updateCrittersCell(row, col);
                break;
            case 'stringthing':
                this.updateStringThingCell(row, col);
                break;
            case 'swapdiag':
                this.updateSwapDiagCell(row, col);
                break;
            case 'tron':
                this.updateTronCell(row, col);
                break;
            case 'sand':
                this.updateSandCell(row, col);
                break;
            case 'bouncygas':
                this.updateBouncyGasCell(row, col);
                break;
            // EXPERIMENTAL & ARTISTIC CA
            case 'liquid':
                this.updateLiquidCell(row, col);
                break;
            case 'crystal':
                this.updateCrystalCell(row, col);
                break;
            case 'plasma':
                this.updatePlasmaCell(row, col);
                break;
            case 'fabric':
                this.updateFabricCell(row, col);
                break;
            case 'neural':
                this.updateNeuralCell(row, col);
                break;
            case 'quantum':
                this.updateQuantumCell(row, col);
                break;
            case 'magnetic':
                this.updateMagneticCell(row, col);
                break;
            case 'gravity':
                this.updateGravityCell(row, col);
                break;
            case 'chemistry':
                this.updateChemistryCell(row, col);
                break;
            case 'ecosystem':
                this.updateEcosystemCell(row, col);
                break;
            case 'music':
                this.updateMusicCell(row, col);
                break;
            case 'fractal':
                this.updateFractalCell(row, col);
                break;
            case 'kaleidoscope':
                this.updateKaleidoscopeCell(row, col);
                break;
            case 'aurora':
                this.updateAuroraCell(row, col);
                break;
            case 'lightning':
                this.updateLightningCell(row, col);
                break;
            // BIOLOGICAL & SELF-REPLICATING CA
            case 'virus':
                this.updateVirusCell(row, col);
                break;
            case 'bacteria':
                this.updateBacteriaCell(row, col);
                break;
            case 'mitosis':
                this.updateMitosisCell(row, col);
                break;
            case 'cancer':
                this.updateCancerCell(row, col);
                break;
            case 'slimemold':
                this.updateSlimeMoldCell(row, col);
                break;
            case 'antcolony':
                this.updateAntColonyCell(row, col);
                break;
            case 'flocking':
                this.updateFlockingCell(row, col);
                break;
            case 'schooling':
                this.updateSchoolingCell(row, col);
                break;
            case 'mycelium':
                this.updateMyceliumCell(row, col);
                break;
            case 'evolution':
                this.updateEvolutionCell(row, col);
                break;
            case 'dna':
                this.updateDNACell(row, col);
                break;
            case 'immune':
                this.updateImmuneCell(row, col);
                break;
            case 'neuron':
                this.updateNeuronCell(row, col);
                break;
            case 'roots':
                this.updateRootsCell(row, col);
                break;
            case 'algae':
                this.updateAlgaeCell(row, col);
                break;
        }
    }

    updateGameOfLifeCell(row, col) {
        const neighbors = this.countNeighbors(row, col, 'gameoflife', 1);
        const cell = this.grid[row][col];
        
        if(cell.state === 1) {
            this.nextGrid[row][col].state = (neighbors === 2 || neighbors === 3) ? 1 : 0;
        } else {
            this.nextGrid[row][col].state = neighbors === 3 ? 1 : 0;
        }
        this.nextGrid[row][col].rule = 'gameoflife';
    }

    updateElementaryCACell(row, col, ruleNumber) {
        // Elementary CA works on rows
        if(this.generation % 2 === 0) return; // Update every other generation
        
        const rule = this.getRuleLookup(ruleNumber);
        const left = this.getCellState(row, col - 1, 'rule' + ruleNumber);
        const center = this.grid[row][col].state;
        const right = this.getCellState(row, col + 1, 'rule' + ruleNumber);
        
        const pattern = (left << 2) | (center << 1) | right;
        this.nextGrid[row + 1] && (this.nextGrid[row + 1][col].state = rule[pattern]);
        this.nextGrid[row + 1] && (this.nextGrid[row + 1][col].rule = 'rule' + ruleNumber);
    }

    updateBriansBrainCell(row, col) {
        const cell = this.grid[row][col];
        const neighbors = this.countNeighbors(row, col, 'brain', 1);
        
        if(cell.state === 0 && neighbors === 2) {
            this.nextGrid[row][col].state = 1; // Birth
        } else if(cell.state === 1) {
            this.nextGrid[row][col].state = 2; // Dying
        } else {
            this.nextGrid[row][col].state = 0; // Dead
        }
        this.nextGrid[row][col].rule = 'brain';
    }

    updateSeedsCell(row, col) {
        const neighbors = this.countNeighbors(row, col, 'seeds', 1);
        const cell = this.grid[row][col];
        
        this.nextGrid[row][col].state = (cell.state === 0 && neighbors === 2) ? 1 : 0;
        this.nextGrid[row][col].rule = 'seeds';
    }

    updateWireworldCell(row, col) {
        const cell = this.grid[row][col];
        
        switch(cell.state) {
            case 0: // Empty
                this.nextGrid[row][col].state = 0;
                break;
            case 1: // Copper wire
                const electronHeads = this.countNeighbors(row, col, 'wireworld', 2);
                this.nextGrid[row][col].state = (electronHeads === 1 || electronHeads === 2) ? 2 : 1;
                break;
            case 2: // Electron head
                this.nextGrid[row][col].state = 3;
                break;
            case 3: // Electron tail
                this.nextGrid[row][col].state = 1;
                break;
        }
        this.nextGrid[row][col].rule = 'wireworld';
    }

    updateForestFireCell(row, col) {
        const cell = this.grid[row][col];
        
        if(cell.state === 0) { // Empty
            this.nextGrid[row][col].state = Math.random() < 0.01 ? 1 : 0; // Grow tree
        } else if(cell.state === 1) { // Tree
            const burningNeighbors = this.countNeighbors(row, col, 'forestfire', 2);
            if(burningNeighbors > 0 || Math.random() < 0.001) {
                this.nextGrid[row][col].state = 2; // Catch fire
            } else {
                this.nextGrid[row][col].state = 1;
            }
        } else if(cell.state === 2) { // Fire
            this.nextGrid[row][col].state = 0; // Burn out
        }
        this.nextGrid[row][col].rule = 'forestfire';
    }

    updateMazeCell(row, col) {
        const neighbors = this.countNeighbors(row, col, 'maze', 1);
        const cell = this.grid[row][col];
        
        if(cell.state === 1) {
            this.nextGrid[row][col].state = neighbors >= 4 ? 1 : 0;
        } else {
            this.nextGrid[row][col].state = neighbors >= 5 ? 1 : 0;
        }
        this.nextGrid[row][col].rule = 'maze';
    }

    // NEW EXCITING CA RULES START HERE!

    // HighLife (B36/S23) - Like Game of Life but with replicators
    updateHighLifeCell(row, col) {
        const neighbors = this.countNeighbors(row, col, 'highlife', 1);
        const cell = this.grid[row][col];
        
        if(cell.state === 1) {
            // Survive with 2 or 3 neighbors
            this.nextGrid[row][col].state = (neighbors === 2 || neighbors === 3) ? 1 : 0;
        } else {
            // Birth with 3 or 6 neighbors
            this.nextGrid[row][col].state = (neighbors === 3 || neighbors === 6) ? 1 : 0;
        }
        this.nextGrid[row][col].rule = 'highlife';
    }

    // Day & Night (B3678/S34678) - Symmetric rule
    updateDayNightCell(row, col) {
        const neighbors = this.countNeighbors(row, col, 'daynight', 1);
        const cell = this.grid[row][col];
        
        if(cell.state === 1) {
            // Survive with 3,4,6,7,8 neighbors
            this.nextGrid[row][col].state = [3,4,6,7,8].includes(neighbors) ? 1 : 0;
        } else {
            // Birth with 3,6,7,8 neighbors
            this.nextGrid[row][col].state = [3,6,7,8].includes(neighbors) ? 1 : 0;
        }
        this.nextGrid[row][col].rule = 'daynight';
    }

    // Replicator (B1357/S1357) - Everything replicates!
    updateReplicatorCell(row, col) {
        const neighbors = this.countNeighbors(row, col, 'replicator', 1);
        const cell = this.grid[row][col];
        
        const birthSurvive = [1,3,5,7];
        
        if(cell.state === 1) {
            this.nextGrid[row][col].state = birthSurvive.includes(neighbors) ? 1 : 0;
        } else {
            this.nextGrid[row][col].state = birthSurvive.includes(neighbors) ? 1 : 0;
        }
        this.nextGrid[row][col].rule = 'replicator';
    }

    // Life without Death (B3/S012345678) - Cells never die
    updateLifeWithoutDeathCell(row, col) {
        const neighbors = this.countNeighbors(row, col, 'lifewithoutdeath', 1);
        const cell = this.grid[row][col];
        
        if(cell.state === 1) {
            // Once alive, always alive
            this.nextGrid[row][col].state = 1;
        } else {
            // Birth with exactly 3 neighbors
            this.nextGrid[row][col].state = neighbors === 3 ? 1 : 0;
        }
        this.nextGrid[row][col].rule = 'lifewithoutdeath';
    }

    // 2x2 (B36/S125) - Works on 2x2 blocks
    updateTwoByTwoCell(row, col) {
        const neighbors = this.countNeighbors(row, col, 'twobytwo', 1);
        const cell = this.grid[row][col];
        
        if(cell.state === 1) {
            // Survive with 1,2,5 neighbors
            this.nextGrid[row][col].state = [1,2,5].includes(neighbors) ? 1 : 0;
        } else {
            // Birth with 3,6 neighbors
            this.nextGrid[row][col].state = [3,6].includes(neighbors) ? 1 : 0;
        }
        this.nextGrid[row][col].rule = 'twobytwo';
    }

    // Morley (B368/S245) - High-period spaceships
    updateMorleyCell(row, col) {
        const neighbors = this.countNeighbors(row, col, 'morley', 1);
        const cell = this.grid[row][col];
        
        if(cell.state === 1) {
            // Survive with 2,4,5 neighbors
            this.nextGrid[row][col].state = [2,4,5].includes(neighbors) ? 1 : 0;
        } else {
            // Birth with 3,6,8 neighbors
            this.nextGrid[row][col].state = [3,6,8].includes(neighbors) ? 1 : 0;
        }
        this.nextGrid[row][col].rule = 'morley';
    }

    // Vote - Simple majority rule
    updateVoteCell(row, col) {
        const neighbors = this.countNeighbors(row, col, 'vote', 1);
        const cell = this.grid[row][col];
        
        // Simple majority rule: if more than half of the 9 cells (including self) are alive, cell becomes/stays alive
        const totalAlive = neighbors + (cell.state === 1 ? 1 : 0);
        this.nextGrid[row][col].state = totalAlive >= 5 ? 1 : 0;
        this.nextGrid[row][col].rule = 'vote';
    }

    // Coral - Growth by accretion
    updateCoralCell(row, col) {
        const neighbors = this.countNeighbors(row, col, 'coral', 1);
        const cell = this.grid[row][col];
        
        if(cell.state === 1) {
            // Once coral, always coral
            this.nextGrid[row][col].state = 1;
        } else {
            // Grow coral if exactly 3 neighbors (like Game of Life birth)
            // But add some randomness for organic growth
            if(neighbors === 3) {
                this.nextGrid[row][col].state = Math.random() < 0.8 ? 1 : 0;
            } else if(neighbors >= 1) {
                // Slow growth near existing coral
                this.nextGrid[row][col].state = Math.random() < 0.02 ? 1 : 0;
            }
        }
        this.nextGrid[row][col].rule = 'coral';
    }

    // Cyclic CA - Colors cycle through states
    updateCyclicCell(row, col) {
        const cell = this.grid[row][col];
        
        // Count neighbors in next state
        const nextState = (cell.state + 1) % 4;
        const neighborsNextState = this.countNeighbors(row, col, 'cyclic', nextState);
        
        if(neighborsNextState >= 1) {
            // Cycle to next state if neighbor has next state
            this.nextGrid[row][col].state = nextState;
        } else {
            // Stay in current state
            this.nextGrid[row][col].state = cell.state;
        }
        this.nextGrid[row][col].rule = 'cyclic';
    }

    // Anneal (B4678/S35678) - Smoothing rule like heat diffusion
    updateAnnealCell(row, col) {
        const neighbors = this.countNeighbors(row, col, 'anneal', 1);
        const cell = this.grid[row][col];
        
        if(cell.state === 1) {
            // Survive with 3,5,6,7,8 neighbors
            this.nextGrid[row][col].state = [3,5,6,7,8].includes(neighbors) ? 1 : 0;
        } else {
            // Birth with 4,6,7,8 neighbors
            this.nextGrid[row][col].state = [4,6,7,8].includes(neighbors) ? 1 : 0;
        }
        this.nextGrid[row][col].rule = 'anneal';
    }

    // GENERATIONS FAMILY - Multi-state CA with aging

    // Generations (B2/S/3) - Basic generations rule
    updateGenerationsCell(row, col) {
        const cell = this.grid[row][col];
        const neighbors = this.countNeighbors(row, col, 'generations', 1); // Count only "young" cells
        
        if(cell.state === 0 && neighbors === 2) {
            // Birth
            this.nextGrid[row][col].state = 1;
        } else if(cell.state === 1) {
            // Age to dying state
            this.nextGrid[row][col].state = 2;
        } else if(cell.state === 2) {
            // Die
            this.nextGrid[row][col].state = 0;
        }
        this.nextGrid[row][col].rule = 'generations';
    }

    // Star Wars (B2/S345/4) - 4 generations
    updateStarWarsCell(row, col) {
        const cell = this.grid[row][col];
        const neighbors = this.countNeighbors(row, col, 'starwars', 1);
        
        if(cell.state === 0 && neighbors === 2) {
            // Birth
            this.nextGrid[row][col].state = 1;
        } else if(cell.state === 1) {
            // Survive with 3,4,5 neighbors, otherwise age
            if([3,4,5].includes(neighbors)) {
                this.nextGrid[row][col].state = 1;
            } else {
                this.nextGrid[row][col].state = 2;
            }
        } else if(cell.state >= 2) {
            // Age through dying states
            this.nextGrid[row][col].state = cell.state < 3 ? cell.state + 1 : 0;
        }
        this.nextGrid[row][col].rule = 'starwars';
    }

    // MORE LIFE-LIKE CA RULES

    // Diamoeba (B35678/S5678) - Forms diamond shapes
    updateDiamoebaCell(row, col) {
        const neighbors = this.countNeighbors(row, col, 'diamoeba', 1);
        const cell = this.grid[row][col];
        
        if(cell.state === 1) {
            // Survive with 5,6,7,8 neighbors
            this.nextGrid[row][col].state = [5,6,7,8].includes(neighbors) ? 1 : 0;
        } else {
            // Birth with 3,5,6,7,8 neighbors
            this.nextGrid[row][col].state = [3,5,6,7,8].includes(neighbors) ? 1 : 0;
        }
        this.nextGrid[row][col].rule = 'diamoeba';
    }

    // Gnarl (B1/S1) - Chaotic growth
    updateGnarlCell(row, col) {
        const neighbors = this.countNeighbors(row, col, 'gnarl', 1);
        const cell = this.grid[row][col];
        
        if(cell.state === 1) {
            // Survive with exactly 1 neighbor
            this.nextGrid[row][col].state = neighbors === 1 ? 1 : 0;
        } else {
            // Birth with exactly 1 neighbor
            this.nextGrid[row][col].state = neighbors === 1 ? 1 : 0;
        }
        this.nextGrid[row][col].rule = 'gnarl';
    }

    // DotLife (B3/S023) - Stable dots
    updateDotLifeCell(row, col) {
        const neighbors = this.countNeighbors(row, col, 'dotlife', 1);
        const cell = this.grid[row][col];
        
        if(cell.state === 1) {
            // Survive with 0,2,3 neighbors
            this.nextGrid[row][col].state = [0,2,3].includes(neighbors) ? 1 : 0;
        } else {
            // Birth with exactly 3 neighbors
            this.nextGrid[row][col].state = neighbors === 3 ? 1 : 0;
        }
        this.nextGrid[row][col].rule = 'dotlife';
    }

    // Pedestrian Life (B38/S23) - Slow moving patterns
    updatePedestrianCell(row, col) {
        const neighbors = this.countNeighbors(row, col, 'pedestrian', 1);
        const cell = this.grid[row][col];
        
        if(cell.state === 1) {
            // Survive with 2,3 neighbors
            this.nextGrid[row][col].state = [2,3].includes(neighbors) ? 1 : 0;
        } else {
            // Birth with 3,8 neighbors
            this.nextGrid[row][col].state = [3,8].includes(neighbors) ? 1 : 0;
        }
        this.nextGrid[row][col].rule = 'pedestrian';
    }

    // Stains (B3678/S235678) - Spreading stains
    updateStainsCell(row, col) {
        const neighbors = this.countNeighbors(row, col, 'stains', 1);
        const cell = this.grid[row][col];
        
        if(cell.state === 1) {
            // Survive with 2,3,5,6,7,8 neighbors
            this.nextGrid[row][col].state = [2,3,5,6,7,8].includes(neighbors) ? 1 : 0;
        } else {
            // Birth with 3,6,7,8 neighbors
            this.nextGrid[row][col].state = [3,6,7,8].includes(neighbors) ? 1 : 0;
        }
        this.nextGrid[row][col].rule = 'stains';
    }

    // Coagulations (B378/S235678) - Clumping behavior
    updateCoagulationsCell(row, col) {
        const neighbors = this.countNeighbors(row, col, 'coagulations', 1);
        const cell = this.grid[row][col];
        
        if(cell.state === 1) {
            // Survive with 2,3,5,6,7,8 neighbors
            this.nextGrid[row][col].state = [2,3,5,6,7,8].includes(neighbors) ? 1 : 0;
        } else {
            // Birth with 3,7,8 neighbors
            this.nextGrid[row][col].state = [3,7,8].includes(neighbors) ? 1 : 0;
        }
        this.nextGrid[row][col].rule = 'coagulations';
    }

    // Worms (B367/S23) - Worm-like patterns
    updateWormsCell(row, col) {
        const neighbors = this.countNeighbors(row, col, 'worms', 1);
        const cell = this.grid[row][col];
        
        if(cell.state === 1) {
            // Survive with 2,3 neighbors
            this.nextGrid[row][col].state = [2,3].includes(neighbors) ? 1 : 0;
        } else {
            // Birth with 3,6,7 neighbors
            this.nextGrid[row][col].state = [3,6,7].includes(neighbors) ? 1 : 0;
        }
        this.nextGrid[row][col].rule = 'worms';
    }

    // Bugs (B3567/S15678) - Bug-like movement
    updateBugsCell(row, col) {
        const neighbors = this.countNeighbors(row, col, 'bugs', 1);
        const cell = this.grid[row][col];
        
        if(cell.state === 1) {
            // Survive with 1,5,6,7,8 neighbors
            this.nextGrid[row][col].state = [1,5,6,7,8].includes(neighbors) ? 1 : 0;
        } else {
            // Birth with 3,5,6,7 neighbors
            this.nextGrid[row][col].state = [3,5,6,7].includes(neighbors) ? 1 : 0;
        }
        this.nextGrid[row][col].rule = 'bugs';
    }

    // CREATIVE & UNIQUE CA RULES

    // BBM (Billiard Ball Machine) - Reversible particle simulation
    updateBBMCell(row, col) {
        const cell = this.grid[row][col];
        
        // Margolus neighborhood simulation - particles bounce like billiard balls
        const neighbors = this.countNeighbors(row, col, 'bbm', 1);
        
        if(cell.state === 1) {
            // Particle movement based on neighbor configuration
            const direction = this.getBBMDirection(row, col);
            this.nextGrid[row][col].state = 0; // Current cell becomes empty
            
            // Move particle to new position
            const newRow = (row + direction.dy + this.rows) % this.rows;
            const newCol = (col + direction.dx + this.cols) % this.cols;
            
            if(this.grid[newRow][newCol].state === 0) {
                this.nextGrid[newRow][newCol].state = 1;
                this.nextGrid[newRow][newCol].rule = 'bbm';
            } else {
                // Collision - bounce back
                this.nextGrid[row][col].state = 1;
            }
        }
        this.nextGrid[row][col].rule = 'bbm';
    }

    getBBMDirection(row, col) {
        // Simple direction based on position and time
        const directions = [{dx: 1, dy: 0}, {dx: 0, dy: 1}, {dx: -1, dy: 0}, {dx: 0, dy: -1}];
        return directions[(row + col + this.generation) % 4];
    }

    // HPP Gas (Hardy-Pazzis-Pomeau) - Lattice gas simulation
    updateHPPGasCell(row, col) {
        const cell = this.grid[row][col];
        
        // HPP gas with 4 possible particle directions
        if(cell.state > 0) {
            // Move particle in its direction
            const directions = [{dx: 1, dy: 0}, {dx: 0, dy: 1}, {dx: -1, dy: 0}, {dx: 0, dy: -1}];
            const dir = directions[cell.state - 1];
            
            const newRow = (row + dir.dy + this.rows) % this.rows;
            const newCol = (col + dir.dx + this.cols) % this.cols;
            
            // Check for collisions and handle them
            if(this.grid[newRow][newCol].state === 0) {
                this.nextGrid[newRow][newCol].state = cell.state;
                this.nextGrid[newRow][newCol].rule = 'hppgas';
            } else {
                // Collision - particles scatter
                this.nextGrid[row][col].state = (cell.state % 4) + 1;
            }
        }
        this.nextGrid[row][col].rule = 'hppgas';
    }

    // Critters - Reversible glider-like patterns
    updateCrittersCell(row, col) {
        const cell = this.grid[row][col];
        const neighbors = this.countNeighbors(row, col, 'critters', 1);
        
        // Critters rule: reversible with glider-like behavior
        if(neighbors === 2) {
            // Keep current state
            this.nextGrid[row][col].state = cell.state;
        } else if(neighbors === 0 || neighbors === 1 || neighbors === 4) {
            // Flip state
            this.nextGrid[row][col].state = 1 - cell.state;
        } else if(neighbors === 3) {
            // Flip and rotate (simplified)
            this.nextGrid[row][col].state = 1 - cell.state;
        } else {
            this.nextGrid[row][col].state = cell.state;
        }
        this.nextGrid[row][col].rule = 'critters';
    }

    // String Thing - Creates string-like patterns
    updateStringThingCell(row, col) {
        const cell = this.grid[row][col];
        const neighbors = this.countNeighbors(row, col, 'stringthing', 1);
        
        // String formation rules
        if(cell.state === 1) {
            // String survives with 2-3 neighbors
            this.nextGrid[row][col].state = [2,3].includes(neighbors) ? 1 : 0;
        } else {
            // New string segment with exactly 3 neighbors
            this.nextGrid[row][col].state = neighbors === 3 ? 1 : 0;
        }
        this.nextGrid[row][col].rule = 'stringthing';
    }

    // Swap On Diagonal - Particles swap positions
    updateSwapDiagCell(row, col) {
        const cell = this.grid[row][col];
        
        // Swap particles along diagonals
        if(cell.state === 1) {
            // Check diagonal neighbors for swapping
            const diagNeighbors = [
                this.grid[(row-1+this.rows)%this.rows][(col-1+this.cols)%this.cols],
                this.grid[(row+1)%this.rows][(col+1)%this.cols]
            ];
            
            if(diagNeighbors[0].state === 0 && diagNeighbors[1].state === 0) {
                // Move diagonally
                this.nextGrid[row][col].state = 0;
                this.nextGrid[(row+1)%this.rows][(col+1)%this.cols].state = 1;
                this.nextGrid[(row+1)%this.rows][(col+1)%this.cols].rule = 'swapdiag';
            } else {
                this.nextGrid[row][col].state = 1;
            }
        }
        this.nextGrid[row][col].rule = 'swapdiag';
    }

    // Tron (Trip-a-tron) - Creates expanding patterns
    updateTronCell(row, col) {
        const cell = this.grid[row][col];
        const neighbors = this.countNeighbors(row, col, 'tron', 1);
        
        // Tron expansion rule
        if(cell.state === 0 && neighbors > 0) {
            this.nextGrid[row][col].state = 1;
        } else if(cell.state === 1 && neighbors >= 4) {
            this.nextGrid[row][col].state = 0;
        } else {
            this.nextGrid[row][col].state = cell.state;
        }
        this.nextGrid[row][col].rule = 'tron';
    }

    // Sand - Gravity simulation
    updateSandCell(row, col) {
        const cell = this.grid[row][col];
        
        if(cell.state === 1) {
            // Sand falls down
            const below = (row + 1) % this.rows;
            if(this.grid[below][col].state === 0) {
                this.nextGrid[row][col].state = 0;
                this.nextGrid[below][col].state = 1;
                this.nextGrid[below][col].rule = 'sand';
            } else {
                // Try to fall diagonally
                const leftDiag = (col - 1 + this.cols) % this.cols;
                const rightDiag = (col + 1) % this.cols;
                
                if(this.grid[below][leftDiag].state === 0 && Math.random() < 0.5) {
                    this.nextGrid[row][col].state = 0;
                    this.nextGrid[below][leftDiag].state = 1;
                    this.nextGrid[below][leftDiag].rule = 'sand';
                } else if(this.grid[below][rightDiag].state === 0) {
                    this.nextGrid[row][col].state = 0;
                    this.nextGrid[below][rightDiag].state = 1;
                    this.nextGrid[below][rightDiag].rule = 'sand';
                } else {
                    this.nextGrid[row][col].state = 1;
                }
            }
        }
        this.nextGrid[row][col].rule = 'sand';
    }

    // Bouncy Gas - Particles that bounce
    updateBouncyGasCell(row, col) {
        const cell = this.grid[row][col];
        
        if(cell.state > 0) {
            // Bouncy movement with random direction changes
            const directions = [{dx: 1, dy: 0}, {dx: 0, dy: 1}, {dx: -1, dy: 0}, {dx: 0, dy: -1}];
            let dir = directions[(cell.state - 1) % 4];
            
            // Random bounce
            if(Math.random() < 0.1) {
                dir = directions[Math.floor(Math.random() * 4)];
            }
            
            const newRow = (row + dir.dy + this.rows) % this.rows;
            const newCol = (col + dir.dx + this.cols) % this.cols;
            
            this.nextGrid[row][col].state = 0;
            this.nextGrid[newRow][newCol].state = (Math.floor(Math.random() * 4) + 1);
            this.nextGrid[newRow][newCol].rule = 'bouncygas';
        }
        this.nextGrid[row][col].rule = 'bouncygas';
    }

    // EXPERIMENTAL & ARTISTIC CA

    // Liquid - Fluid simulation
    updateLiquidCell(row, col) {
        const cell = this.grid[row][col];
        const neighbors = this.countNeighbors(row, col, 'liquid', 1);
        
        // Liquid flow simulation
        if(cell.state === 1) {
            // Liquid flows to lower pressure areas
            if(neighbors < 3) {
                // Try to flow down
                const below = (row + 1) % this.rows;
                if(this.grid[below][col].state === 0) {
                    this.nextGrid[row][col].state = 0;
                    this.nextGrid[below][col].state = 1;
                    this.nextGrid[below][col].rule = 'liquid';
                } else {
                    this.nextGrid[row][col].state = 1;
                }
            } else {
                this.nextGrid[row][col].state = neighbors < 6 ? 1 : 0;
            }
        } else {
            this.nextGrid[row][col].state = neighbors >= 3 ? 1 : 0;
        }
        this.nextGrid[row][col].rule = 'liquid';
    }

    // Crystal - Crystal growth patterns
    updateCrystalCell(row, col) {
        const cell = this.grid[row][col];
        const neighbors = this.countNeighbors(row, col, 'crystal', 1);
        
        // Crystal growth with multiple states
        if(cell.state === 0 && neighbors === 1) {
            this.nextGrid[row][col].state = 1; // Seed
        } else if(cell.state === 1 && neighbors >= 2) {
            this.nextGrid[row][col].state = 2; // Growing
        } else if(cell.state === 2) {
            this.nextGrid[row][col].state = 3; // Mature
        } else if(cell.state === 3 && neighbors < 2) {
            this.nextGrid[row][col].state = 0; // Dissolve
        } else {
            this.nextGrid[row][col].state = cell.state;
        }
        this.nextGrid[row][col].rule = 'crystal';
    }

    // Plasma - Wave-like plasma simulation
    updatePlasmaCell(row, col) {
        const cell = this.grid[row][col];
        const neighbors = this.countNeighbors(row, col, 'plasma', 1);
        
        // Plasma wave propagation
        const waveValue = Math.sin((row + col + this.generation) * 0.1) * 0.5 + 0.5;
        
        if(waveValue > 0.6 && neighbors >= 2) {
            this.nextGrid[row][col].state = Math.min(4, cell.state + 1);
        } else if(cell.state > 0) {
            this.nextGrid[row][col].state = Math.max(0, cell.state - 1);
        }
        this.nextGrid[row][col].rule = 'plasma';
    }

    // Fabric - Weaving patterns
    updateFabricCell(row, col) {
        const cell = this.grid[row][col];
        
        // Fabric weaving pattern
        const warpThread = (row + this.generation) % 4 < 2;
        const weftThread = (col + this.generation) % 4 < 2;
        
        if(warpThread && weftThread) {
            this.nextGrid[row][col].state = 3; // Intersection
        } else if(warpThread) {
            this.nextGrid[row][col].state = 1; // Warp
        } else if(weftThread) {
            this.nextGrid[row][col].state = 2; // Weft
        } else {
            this.nextGrid[row][col].state = 0; // Empty
        }
        this.nextGrid[row][col].rule = 'fabric';
    }

    // Neural - Neural network simulation
    updateNeuralCell(row, col) {
        const cell = this.grid[row][col];
        const neighbors = this.countNeighbors(row, col, 'neural', 1);
        
        // Neural activation function
        const activation = neighbors * 0.125; // 8 neighbors max
        
        if(cell.state === 0 && activation > 0.5) {
            this.nextGrid[row][col].state = 1; // Activate
        } else if(cell.state === 1 && activation < 0.3) {
            this.nextGrid[row][col].state = 0; // Deactivate
        } else if(cell.state === 1) {
            this.nextGrid[row][col].state = 2; // Firing
        } else if(cell.state === 2) {
            this.nextGrid[row][col].state = 3; // Refractory
        } else if(cell.state === 3) {
            this.nextGrid[row][col].state = 0; // Reset
        }
        this.nextGrid[row][col].rule = 'neural';
    }

    // Quantum - Quantum dot simulation
    updateQuantumCell(row, col) {
        const cell = this.grid[row][col];
        
        // Quantum tunneling effect
        const tunnelProb = Math.sin((row * col + this.generation) * 0.05) * 0.5 + 0.5;
        
        if(cell.state === 0 && tunnelProb > 0.8) {
            this.nextGrid[row][col].state = 1; // Quantum excitation
        } else if(cell.state === 1 && tunnelProb < 0.2) {
            this.nextGrid[row][col].state = 0; // Quantum decay
        } else if(cell.state === 1) {
            // Quantum superposition states
            this.nextGrid[row][col].state = Math.floor(tunnelProb * 4) + 1;
        }
        this.nextGrid[row][col].rule = 'quantum';
    }

    // Magnetic - Magnetic field simulation
    updateMagneticCell(row, col) {
        const cell = this.grid[row][col];
        
        // Magnetic field lines
        const fieldStrength = Math.cos(row * 0.1) * Math.sin(col * 0.1);
        
        if(Math.abs(fieldStrength) > 0.5) {
            this.nextGrid[row][col].state = fieldStrength > 0 ? 1 : 2; // North/South
        } else {
            this.nextGrid[row][col].state = 0;
        }
        this.nextGrid[row][col].rule = 'magnetic';
    }

    // Gravity - Gravitational simulation
    updateGravityCell(row, col) {
        const cell = this.grid[row][col];
        
        if(cell.state === 1) {
            // Particles fall towards gravity wells
            const centerRow = Math.floor(this.rows / 2);
            const centerCol = Math.floor(this.cols / 2);
            
            const dx = centerCol - col;
            const dy = centerRow - row;
            
            if(Math.abs(dx) > Math.abs(dy)) {
                const newCol = dx > 0 ? col + 1 : col - 1;
                if(this.isValidPosition(row, newCol) && this.grid[row][newCol].state === 0) {
                    this.nextGrid[row][col].state = 0;
                    this.nextGrid[row][newCol].state = 1;
                    this.nextGrid[row][newCol].rule = 'gravity';
                } else {
                    this.nextGrid[row][col].state = 1;
                }
            } else {
                const newRow = dy > 0 ? row + 1 : row - 1;
                if(this.isValidPosition(newRow, col) && this.grid[newRow][col].state === 0) {
                    this.nextGrid[row][col].state = 0;
                    this.nextGrid[newRow][col].state = 1;
                    this.nextGrid[newRow][col].rule = 'gravity';
                } else {
                    this.nextGrid[row][col].state = 1;
                }
            }
        }
        this.nextGrid[row][col].rule = 'gravity';
    }

    // Chemistry - Chemical reaction simulation
    updateChemistryCell(row, col) {
        const cell = this.grid[row][col];
        const neighbors = this.countNeighbors(row, col, 'chemistry', 1);
        
        // Chemical reaction states: 0=empty, 1=reactant A, 2=reactant B, 3=product
        if(cell.state === 1 && neighbors >= 2) {
            this.nextGrid[row][col].state = 3; // A + catalyst -> product
        } else if(cell.state === 2 && neighbors >= 1) {
            this.nextGrid[row][col].state = 3; // B + catalyst -> product
        } else if(cell.state === 3 && neighbors < 2) {
            this.nextGrid[row][col].state = Math.random() < 0.5 ? 1 : 2; // Product decay
        } else if(cell.state === 0 && neighbors === 3) {
            this.nextGrid[row][col].state = 1; // Spontaneous generation
        } else {
            this.nextGrid[row][col].state = cell.state;
        }
        this.nextGrid[row][col].rule = 'chemistry';
    }

    // Ecosystem - Predator-prey simulation
    updateEcosystemCell(row, col) {
        const cell = this.grid[row][col];
        const neighbors = this.countNeighbors(row, col, 'ecosystem', 1);
        const predators = this.countNeighbors(row, col, 'ecosystem', 2);
        
        // 0=empty, 1=prey, 2=predator
        if(cell.state === 0 && neighbors >= 2 && predators === 0) {
            this.nextGrid[row][col].state = 1; // Prey birth
        } else if(cell.state === 1 && predators > 0) {
            this.nextGrid[row][col].state = 0; // Prey eaten
        } else if(cell.state === 1 && neighbors >= 4) {
            this.nextGrid[row][col].state = 0; // Overpopulation
        } else if(cell.state === 2 && neighbors === 0) {
            this.nextGrid[row][col].state = 0; // Predator starves
        } else if(cell.state === 0 && predators >= 2) {
            this.nextGrid[row][col].state = 2; // Predator birth
        } else {
            this.nextGrid[row][col].state = cell.state;
        }
        this.nextGrid[row][col].rule = 'ecosystem';
    }

    // Music - Musical pattern generation
    updateMusicCell(row, col) {
        const cell = this.grid[row][col];
        
        // Musical scales and harmonics
        const note = (row + col) % 12; // 12-tone scale
        const beat = this.generation % 16; // 16-beat pattern
        
        if(beat === note || beat === (note + 4) % 12 || beat === (note + 7) % 12) {
            this.nextGrid[row][col].state = (note % 4) + 1; // Chord tones
        } else {
            this.nextGrid[row][col].state = 0;
        }
        this.nextGrid[row][col].rule = 'music';
    }

    // Fractal - Fractal pattern generator
    updateFractalCell(row, col) {
        const cell = this.grid[row][col];
        
        // Mandelbrot-like iteration
        const x = (col - this.cols/2) / (this.cols/4);
        const y = (row - this.rows/2) / (this.rows/4);
        
        let zx = x, zy = y;
        let iteration = 0;
        
        for(let i = 0; i < 10; i++) {
            const zx2 = zx * zx - zy * zy + x;
            const zy2 = 2 * zx * zy + y;
            
            if(zx2 * zx2 + zy2 * zy2 > 4) break;
            
            zx = zx2;
            zy = zy2;
            iteration++;
        }
        
        this.nextGrid[row][col].state = iteration % 5;
        this.nextGrid[row][col].rule = 'fractal';
    }

    // Kaleidoscope - Symmetric patterns
    updateKaleidoscopeCell(row, col) {
        const cell = this.grid[row][col];
        
        // Create kaleidoscope symmetry
        const centerRow = Math.floor(this.rows / 2);
        const centerCol = Math.floor(this.cols / 2);
        
        const dx = col - centerCol;
        const dy = row - centerRow;
        const angle = Math.atan2(dy, dx);
        const radius = Math.sqrt(dx * dx + dy * dy);
        
        const symmetricAngle = Math.floor(angle / (Math.PI / 6)) * (Math.PI / 6);
        const pattern = Math.sin(radius * 0.1 + this.generation * 0.1 + symmetricAngle * 3);
        
        this.nextGrid[row][col].state = pattern > 0 ? Math.floor(pattern * 4) + 1 : 0;
        this.nextGrid[row][col].rule = 'kaleidoscope';
    }

    // Aurora - Aurora borealis simulation
    updateAuroraCell(row, col) {
        const cell = this.grid[row][col];
        
        // Aurora wave patterns
        const wave1 = Math.sin((col + this.generation) * 0.05) * 0.5 + 0.5;
        const wave2 = Math.sin((col + this.generation * 0.7) * 0.03) * 0.5 + 0.5;
        const intensity = wave1 * wave2;
        
        if(row < this.rows * 0.3 && intensity > 0.6) {
            this.nextGrid[row][col].state = Math.floor(intensity * 4) + 1;
        } else {
            this.nextGrid[row][col].state = Math.max(0, cell.state - 1);
        }
        this.nextGrid[row][col].rule = 'aurora';
    }

    // Lightning - Lightning bolt simulation
    updateLightningCell(row, col) {
        const cell = this.grid[row][col];
        
        // Lightning bolt generation
        if(this.generation % 30 === 0 && Math.random() < 0.001) {
            // Start new lightning bolt
            this.nextGrid[row][col].state = 4; // Bright flash
        } else if(cell.state > 0) {
            // Lightning propagation
            this.nextGrid[row][col].state = Math.max(0, cell.state - 1);
            
            // Spread to neighbors
            if(cell.state === 4 && Math.random() < 0.3) {
                const directions = [{dx: 0, dy: 1}, {dx: 1, dy: 1}, {dx: -1, dy: 1}];
                const dir = directions[Math.floor(Math.random() * directions.length)];
                const newRow = (row + dir.dy + this.rows) % this.rows;
                const newCol = (col + dir.dx + this.cols) % this.cols;
                
                if(this.grid[newRow][newCol].state === 0) {
                    this.nextGrid[newRow][newCol].state = 3;
                    this.nextGrid[newRow][newCol].rule = 'lightning';
                }
            }
        }
        this.nextGrid[row][col].rule = 'lightning';
    }

    // BIOLOGICAL & SELF-REPLICATING CA IMPLEMENTATIONS

    // Virus - Exponential spread like real viruses
    updateVirusCell(row, col) {
        const cell = this.grid[row][col];
        const neighbors = this.countNeighbors(row, col, 'virus', 1);
        
        if(cell.state === 0 && neighbors >= 1) {
            // Infection spreads exponentially
            this.nextGrid[row][col].state = Math.random() < 0.3 ? 1 : 0;
        } else if(cell.state === 1) {
            // Virus replicates and spreads
            this.nextGrid[row][col].state = 1;
            
            // Spread to all neighbors with high probability
            for(let i = -1; i <= 1; i++) {
                for(let j = -1; j <= 1; j++) {
                    if(i === 0 && j === 0) continue;
                    
                    const newRow = (row + i + this.rows) % this.rows;
                    const newCol = (col + j + this.cols) % this.cols;
                    
                    if(this.grid[newRow][newCol].state === 0 && Math.random() < 0.4) {
                        this.nextGrid[newRow][newCol].state = 1;
                        this.nextGrid[newRow][newCol].rule = 'virus';
                    }
                }
            }
        }
        this.nextGrid[row][col].rule = 'virus';
    }

    // Bacteria - Colony growth with resource competition
    updateBacteriaCell(row, col) {
        const cell = this.grid[row][col];
        const neighbors = this.countNeighbors(row, col, 'bacteria', 1);
        
        if(cell.state === 0 && neighbors >= 2 && neighbors <= 3) {
            // Bacterial reproduction
            this.nextGrid[row][col].state = 1;
        } else if(cell.state === 1) {
            // Survive if not overcrowded
            if(neighbors <= 5) {
                this.nextGrid[row][col].state = 1;
                
                // Binary fission - create new bacteria
                if(neighbors === 2 && Math.random() < 0.6) {
                    const directions = [{dx: 1, dy: 0}, {dx: 0, dy: 1}, {dx: -1, dy: 0}, {dx: 0, dy: -1}];
                    const dir = directions[Math.floor(Math.random() * directions.length)];
                    const newRow = (row + dir.dy + this.rows) % this.rows;
                    const newCol = (col + dir.dx + this.cols) % this.cols;
                    
                    if(this.grid[newRow][newCol].state === 0) {
                        this.nextGrid[newRow][newCol].state = 1;
                        this.nextGrid[newRow][newCol].rule = 'bacteria';
                    }
                }
            } else {
                // Die from overcrowding
                this.nextGrid[row][col].state = 0;
            }
        }
        this.nextGrid[row][col].rule = 'bacteria';
    }

    // Mitosis - Cell division simulation
    updateMitosisCell(row, col) {
        const cell = this.grid[row][col];
        
        if(cell.state === 1) {
            // Cell division cycle
            if(cell.age > 0 && cell.age % 8 === 0) {
                // Mitosis occurs - create daughter cells
                const emptyNeighbors = [];
                for(let i = -1; i <= 1; i++) {
                    for(let j = -1; j <= 1; j++) {
                        if(i === 0 && j === 0) continue;
                        
                        const newRow = (row + i + this.rows) % this.rows;
                        const newCol = (col + j + this.cols) % this.cols;
                        
                        if(this.grid[newRow][newCol].state === 0) {
                            emptyNeighbors.push({row: newRow, col: newCol});
                        }
                    }
                }
                
                // Create up to 2 daughter cells
                for(let i = 0; i < Math.min(2, emptyNeighbors.length); i++) {
                    const pos = emptyNeighbors[Math.floor(Math.random() * emptyNeighbors.length)];
                    this.nextGrid[pos.row][pos.col].state = 1;
                    this.nextGrid[pos.row][pos.col].rule = 'mitosis';
                    this.nextGrid[pos.row][pos.col].age = 0;
                }
            }
            this.nextGrid[row][col].state = 1;
        }
        this.nextGrid[row][col].rule = 'mitosis';
    }

    // Cancer - Uncontrolled growth
    updateCancerCell(row, col) {
        const cell = this.grid[row][col];
        const neighbors = this.countNeighbors(row, col, 'cancer', 1);
        
        if(cell.state === 1) {
            // Cancer always survives and grows aggressively
            this.nextGrid[row][col].state = 1;
            
            // Uncontrolled growth - spread to all empty neighbors
            for(let i = -1; i <= 1; i++) {
                for(let j = -1; j <= 1; j++) {
                    if(i === 0 && j === 0) continue;
                    
                    const newRow = (row + i + this.rows) % this.rows;
                    const newCol = (col + j + this.cols) % this.cols;
                    
                    if(this.grid[newRow][newCol].state === 0 && Math.random() < 0.5) {
                        this.nextGrid[newRow][newCol].state = 1;
                        this.nextGrid[newRow][newCol].rule = 'cancer';
                    }
                }
            }
        } else if(neighbors >= 1) {
            // Metastasis - cancer spreads even to empty areas
            this.nextGrid[row][col].state = Math.random() < 0.2 ? 1 : 0;
        }
        this.nextGrid[row][col].rule = 'cancer';
    }

    // Slime Mold - Physarum-like behavior
    updateSlimeMoldCell(row, col) {
        const cell = this.grid[row][col];
        const neighbors = this.countNeighbors(row, col, 'slimemold', 1);
        
        if(cell.state === 1) {
            // Slime mold forms networks
            if(neighbors >= 1 && neighbors <= 3) {
                this.nextGrid[row][col].state = 1;
                
                // Extend pseudopodia (search for food)
                if(Math.random() < 0.3) {
                    const directions = [{dx: 1, dy: 0}, {dx: 0, dy: 1}, {dx: -1, dy: 0}, {dx: 0, dy: -1}];
                    const dir = directions[Math.floor(Math.random() * directions.length)];
                    const newRow = (row + dir.dy + this.rows) % this.rows;
                    const newCol = (col + dir.dx + this.cols) % this.cols;
                    
                    if(this.grid[newRow][newCol].state === 0) {
                        this.nextGrid[newRow][newCol].state = 1;
                        this.nextGrid[newRow][newCol].rule = 'slimemold';
                    }
                }
            } else if(neighbors > 3) {
                // Too crowded - retract
                this.nextGrid[row][col].state = 0;
            } else {
                this.nextGrid[row][col].state = 1;
            }
        } else if(neighbors === 2) {
            // Form connection between existing slime mold
            this.nextGrid[row][col].state = 1;
        }
        this.nextGrid[row][col].rule = 'slimemold';
    }

    // Ant Colony - Swarm intelligence
    updateAntColonyCell(row, col) {
        const cell = this.grid[row][col];
        const neighbors = this.countNeighbors(row, col, 'antcolony', 1);
        
        // Multi-state: 0=empty, 1=ant, 2=pheromone trail, 3=food
        if(cell.state === 1) {
            // Ant movement - follow pheromone trails
            const pheromoneNeighbors = this.countNeighbors(row, col, 'antcolony', 2);
            
            if(pheromoneNeighbors > 0) {
                // Follow pheromone trail
                this.nextGrid[row][col].state = 2; // Leave pheromone
                
                // Move ant to neighboring cell with pheromone
                for(let i = -1; i <= 1; i++) {
                    for(let j = -1; j <= 1; j++) {
                        if(i === 0 && j === 0) continue;
                        
                        const newRow = (row + i + this.rows) % this.rows;
                        const newCol = (col + j + this.cols) % this.cols;
                        
                        if(this.grid[newRow][newCol].state === 2 && Math.random() < 0.3) {
                            this.nextGrid[newRow][newCol].state = 1;
                            this.nextGrid[newRow][newCol].rule = 'antcolony';
                            break;
                        }
                    }
                }
            } else {
                // Random exploration
                this.nextGrid[row][col].state = 2; // Leave pheromone
                
                const directions = [{dx: 1, dy: 0}, {dx: 0, dy: 1}, {dx: -1, dy: 0}, {dx: 0, dy: -1}];
                const dir = directions[Math.floor(Math.random() * directions.length)];
                const newRow = (row + dir.dy + this.rows) % this.rows;
                const newCol = (col + dir.dx + this.cols) % this.cols;
                
                if(this.grid[newRow][newCol].state === 0) {
                    this.nextGrid[newRow][newCol].state = 1;
                    this.nextGrid[newRow][newCol].rule = 'antcolony';
                }
            }
        } else if(cell.state === 2) {
            // Pheromone evaporation
            this.nextGrid[row][col].state = Math.random() < 0.1 ? 0 : 2;
        } else if(cell.state === 0 && neighbors >= 3) {
            // Spawn new ant from colony
            this.nextGrid[row][col].state = Math.random() < 0.1 ? 1 : 0;
        }
        this.nextGrid[row][col].rule = 'antcolony';
    }

    // Flocking - Bird flocking behavior (Boids)
    updateFlockingCell(row, col) {
        const cell = this.grid[row][col];
        const neighbors = this.countNeighbors(row, col, 'flocking', 1);
        
        if(cell.state === 1) {
            // Flocking rules: separation, alignment, cohesion
            if(neighbors >= 2 && neighbors <= 4) {
                this.nextGrid[row][col].state = 1;
                
                // Move towards center of local flock
                if(Math.random() < 0.4) {
                    let avgRow = 0, avgCol = 0, count = 0;
                    
                    for(let i = -2; i <= 2; i++) {
                        for(let j = -2; j <= 2; j++) {
                            const newRow = (row + i + this.rows) % this.rows;
                            const newCol = (col + j + this.cols) % this.cols;
                            
                            if(this.grid[newRow][newCol].rule === 'flocking' && this.grid[newRow][newCol].state === 1) {
                                avgRow += newRow;
                                avgCol += newCol;
                                count++;
                            }
                        }
                    }
                    
                    if(count > 1) {
                        avgRow = Math.floor(avgRow / count);
                        avgCol = Math.floor(avgCol / count);
                        
                        const moveRow = avgRow > row ? row + 1 : (avgRow < row ? row - 1 : row);
                        const moveCol = avgCol > col ? col + 1 : (avgCol < col ? col - 1 : col);
                        
                        if(this.isValidPosition(moveRow, moveCol) && this.grid[moveRow][moveCol].state === 0) {
                            this.nextGrid[row][col].state = 0;
                            this.nextGrid[moveRow][moveCol].state = 1;
                            this.nextGrid[moveRow][moveCol].rule = 'flocking';
                        }
                    }
                }
            } else if(neighbors > 4) {
                // Too crowded - separate
                this.nextGrid[row][col].state = 0;
            } else {
                this.nextGrid[row][col].state = 1;
            }
        } else if(neighbors === 3) {
            // Join flock
            this.nextGrid[row][col].state = 1;
        }
        this.nextGrid[row][col].rule = 'flocking';
    }

    // Schooling - Fish schooling behavior
    updateSchoolingCell(row, col) {
        const cell = this.grid[row][col];
        const neighbors = this.countNeighbors(row, col, 'schooling', 1);
        
        // Similar to flocking but with tighter groups
        if(cell.state === 1) {
            if(neighbors >= 3 && neighbors <= 5) {
                this.nextGrid[row][col].state = 1;
            } else if(neighbors < 3) {
                // Seek school
                for(let i = -1; i <= 1; i++) {
                    for(let j = -1; j <= 1; j++) {
                        if(i === 0 && j === 0) continue;
                        
                        const newRow = (row + i + this.rows) % this.rows;
                        const newCol = (col + j + this.cols) % this.cols;
                        
                        if(this.countNeighbors(newRow, newCol, 'schooling', 1) > neighbors) {
                            if(this.grid[newRow][newCol].state === 0) {
                                this.nextGrid[row][col].state = 0;
                                this.nextGrid[newRow][newCol].state = 1;
                                this.nextGrid[newRow][newCol].rule = 'schooling';
                                break;
                            }
                        }
                    }
                }
                if(this.nextGrid[row][col].state !== 0) {
                    this.nextGrid[row][col].state = 1;
                }
            } else {
                // Too crowded
                this.nextGrid[row][col].state = 0;
            }
        } else if(neighbors >= 4) {
            // Join school
            this.nextGrid[row][col].state = 1;
        }
        this.nextGrid[row][col].rule = 'schooling';
    }

    // Mycelium - Fungal network growth
    updateMyceliumCell(row, col) {
        const cell = this.grid[row][col];
        const neighbors = this.countNeighbors(row, col, 'mycelium', 1);
        
        if(cell.state === 1) {
            // Mycelium forms branching networks
            this.nextGrid[row][col].state = 1;
            
            // Extend hyphae in branching pattern
            if(neighbors <= 2 && Math.random() < 0.4) {
                const directions = [{dx: 1, dy: 0}, {dx: 0, dy: 1}, {dx: -1, dy: 0}, {dx: 0, dy: -1}];
                
                for(const dir of directions) {
                    if(Math.random() < 0.3) {
                        const newRow = (row + dir.dy + this.rows) % this.rows;
                        const newCol = (col + dir.dx + this.cols) % this.cols;
                        
                        if(this.grid[newRow][newCol].state === 0) {
                            this.nextGrid[newRow][newCol].state = 1;
                            this.nextGrid[newRow][newCol].rule = 'mycelium';
                        }
                    }
                }
            }
        } else if(neighbors >= 1 && neighbors <= 2) {
            // Grow towards existing mycelium
            this.nextGrid[row][col].state = Math.random() < 0.3 ? 1 : 0;
        }
        this.nextGrid[row][col].rule = 'mycelium';
    }

    // Evolution - Genetic algorithm simulation
    updateEvolutionCell(row, col) {
        const cell = this.grid[row][col];
        const neighbors = this.countNeighbors(row, col, 'evolution', 1);
        
        // Multi-state representing different "species" or fitness levels
        if(cell.state > 0) {
            // Survival of the fittest
            const fitness = cell.state;
            const avgFitness = this.getAverageFitness(row, col);
            
            if(fitness >= avgFitness) {
                // Survive and potentially reproduce
                this.nextGrid[row][col].state = Math.min(4, fitness + (Math.random() < 0.1 ? 1 : 0));
                
                // Reproduction
                if(neighbors >= 2 && neighbors <= 3 && Math.random() < 0.3) {
                    for(let i = -1; i <= 1; i++) {
                        for(let j = -1; j <= 1; j++) {
                            if(i === 0 && j === 0) continue;
                            
                            const newRow = (row + i + this.rows) % this.rows;
                            const newCol = (col + j + this.cols) % this.cols;
                            
                            if(this.grid[newRow][newCol].state === 0 && Math.random() < 0.2) {
                                // Offspring with mutation
                                const offspring = Math.max(1, fitness + (Math.random() < 0.3 ? (Math.random() < 0.5 ? 1 : -1) : 0));
                                this.nextGrid[newRow][newCol].state = Math.min(4, offspring);
                                this.nextGrid[newRow][newCol].rule = 'evolution';
                            }
                        }
                    }
                }
            } else {
                // Die due to low fitness
                this.nextGrid[row][col].state = Math.max(0, fitness - 1);
            }
        } else if(neighbors >= 3) {
            // Spontaneous generation
            this.nextGrid[row][col].state = 1;
        }
        this.nextGrid[row][col].rule = 'evolution';
    }

    // DNA - DNA replication and transcription
    updateDNACell(row, col) {
        const cell = this.grid[row][col];
        
        // Multi-state: 1=A, 2=T, 3=G, 4=C (DNA bases)
        if(cell.state > 0) {
            // DNA replication - create complementary strand
            this.nextGrid[row][col].state = cell.state;
            
            if(cell.age > 0 && cell.age % 10 === 0) {
                // Replication event
                const complement = this.getDNAComplement(cell.state);
                
                for(let i = -1; i <= 1; i++) {
                    for(let j = -1; j <= 1; j++) {
                        if(i === 0 && j === 0) continue;
                        
                        const newRow = (row + i + this.rows) % this.rows;
                        const newCol = (col + j + this.cols) % this.cols;
                        
                        if(this.grid[newRow][newCol].state === 0 && Math.random() < 0.3) {
                            this.nextGrid[newRow][newCol].state = complement;
                            this.nextGrid[newRow][newCol].rule = 'dna';
                        }
                    }
                }
            }
        } else {
            // Random DNA generation
            const neighbors = this.countNeighbors(row, col, 'dna', 1) + 
                            this.countNeighbors(row, col, 'dna', 2) + 
                            this.countNeighbors(row, col, 'dna', 3) + 
                            this.countNeighbors(row, col, 'dna', 4);
            
            if(neighbors >= 2) {
                this.nextGrid[row][col].state = Math.floor(Math.random() * 4) + 1;
            }
        }
        this.nextGrid[row][col].rule = 'dna';
    }

    // Immune System - Immune response simulation
    updateImmuneCell(row, col) {
        const cell = this.grid[row][col];
        
        // Multi-state: 1=pathogen, 2=T-cell, 3=B-cell, 4=antibody
        if(cell.state === 1) {
            // Pathogen replication
            this.nextGrid[row][col].state = 1;
            
            if(Math.random() < 0.4) {
                const directions = [{dx: 1, dy: 0}, {dx: 0, dy: 1}, {dx: -1, dy: 0}, {dx: 0, dy: -1}];
                const dir = directions[Math.floor(Math.random() * directions.length)];
                const newRow = (row + dir.dy + this.rows) % this.rows;
                const newCol = (col + dir.dx + this.cols) % this.cols;
                
                if(this.grid[newRow][newCol].state === 0) {
                    this.nextGrid[newRow][newCol].state = 1;
                    this.nextGrid[newRow][newCol].rule = 'immune';
                }
            }
        } else if(cell.state === 2) {
            // T-cell response
            const pathogens = this.countNeighbors(row, col, 'immune', 1);
            if(pathogens > 0) {
                // Activate and proliferate
                this.nextGrid[row][col].state = 2;
                
                for(let i = -1; i <= 1; i++) {
                    for(let j = -1; j <= 1; j++) {
                        if(i === 0 && j === 0) continue;
                        
                        const newRow = (row + i + this.rows) % this.rows;
                        const newCol = (col + j + this.cols) % this.cols;
                        
                        if(this.grid[newRow][newCol].state === 1) {
                            // Kill pathogen
                            this.nextGrid[newRow][newCol].state = 0;
                        } else if(this.grid[newRow][newCol].state === 0 && Math.random() < 0.2) {
                            // Create more T-cells
                            this.nextGrid[newRow][newCol].state = 2;
                            this.nextGrid[newRow][newCol].rule = 'immune';
                        }
                    }
                }
            } else {
                this.nextGrid[row][col].state = 2;
            }
        } else if(cell.state === 0) {
            // Generate immune response to nearby pathogens
            const pathogens = this.countNeighbors(row, col, 'immune', 1);
            if(pathogens >= 2) {
                this.nextGrid[row][col].state = Math.random() < 0.5 ? 2 : 3; // T-cell or B-cell
            }
        }
        this.nextGrid[row][col].rule = 'immune';
    }

    // Neural Growth - Neuron development and connection
    updateNeuronCell(row, col) {
        const cell = this.grid[row][col];
        const neighbors = this.countNeighbors(row, col, 'neuron', 1);
        
        if(cell.state === 1) {
            // Neuron growth and connection
            this.nextGrid[row][col].state = 1;
            
            // Extend dendrites and axons
            if(neighbors <= 3 && Math.random() < 0.3) {
                const directions = [{dx: 1, dy: 0}, {dx: 0, dy: 1}, {dx: -1, dy: 0}, {dx: 0, dy: -1}];
                const dir = directions[Math.floor(Math.random() * directions.length)];
                const newRow = (row + dir.dy + this.rows) % this.rows;
                const newCol = (col + dir.dx + this.cols) % this.cols;
                
                if(this.grid[newRow][newCol].state === 0) {
                    this.nextGrid[newRow][newCol].state = 1;
                    this.nextGrid[newRow][newCol].rule = 'neuron';
                }
            }
        } else if(neighbors >= 2 && neighbors <= 3) {
            // Form neural connections
            this.nextGrid[row][col].state = 1;
        }
        this.nextGrid[row][col].rule = 'neuron';
    }

    // Root System - Plant root growth
    updateRootsCell(row, col) {
        const cell = this.grid[row][col];
        const neighbors = this.countNeighbors(row, col, 'roots', 1);
        
        if(cell.state === 1) {
            // Root growth - prefer downward and outward
            this.nextGrid[row][col].state = 1;
            
            if(neighbors <= 2 && Math.random() < 0.4) {
                // Gravitropism - prefer growing downward
                const directions = [{dx: 0, dy: 1, weight: 0.5}, {dx: 1, dy: 1, weight: 0.3}, 
                                  {dx: -1, dy: 1, weight: 0.3}, {dx: 1, dy: 0, weight: 0.2}, 
                                  {dx: -1, dy: 0, weight: 0.2}];
                
                for(const dir of directions) {
                    if(Math.random() < dir.weight) {
                        const newRow = (row + dir.dy + this.rows) % this.rows;
                        const newCol = (col + dir.dx + this.cols) % this.cols;
                        
                        if(this.grid[newRow][newCol].state === 0) {
                            this.nextGrid[newRow][newCol].state = 1;
                            this.nextGrid[newRow][newCol].rule = 'roots';
                        }
                    }
                }
            }
        } else if(neighbors >= 1 && neighbors <= 2) {
            // Grow towards existing roots
            this.nextGrid[row][col].state = Math.random() < 0.2 ? 1 : 0;
        }
        this.nextGrid[row][col].rule = 'roots';
    }

    // Algae Bloom - Exponential algae growth
    updateAlgaeCell(row, col) {
        const cell = this.grid[row][col];
        const neighbors = this.countNeighbors(row, col, 'algae', 1);
        
        if(cell.state === 1) {
            // Algae photosynthesis and reproduction
            this.nextGrid[row][col].state = 1;
            
            // Exponential growth under good conditions
            if(neighbors <= 4 && Math.random() < 0.6) {
                for(let i = -1; i <= 1; i++) {
                    for(let j = -1; j <= 1; j++) {
                        if(i === 0 && j === 0) continue;
                        
                        const newRow = (row + i + this.rows) % this.rows;
                        const newCol = (col + j + this.cols) % this.cols;
                        
                        if(this.grid[newRow][newCol].state === 0 && Math.random() < 0.3) {
                            this.nextGrid[newRow][newCol].state = 1;
                            this.nextGrid[newRow][newCol].rule = 'algae';
                        }
                    }
                }
            } else if(neighbors > 6) {
                // Die from overcrowding/nutrient depletion
                this.nextGrid[row][col].state = 0;
            }
        } else if(neighbors >= 2) {
            // Spore germination
            this.nextGrid[row][col].state = Math.random() < 0.4 ? 1 : 0;
        }
        this.nextGrid[row][col].rule = 'algae';
    }

    // Helper methods for biological CA
    getAverageFitness(row, col) {
        let totalFitness = 0;
        let count = 0;
        
        for(let i = -2; i <= 2; i++) {
            for(let j = -2; j <= 2; j++) {
                const newRow = (row + i + this.rows) % this.rows;
                const newCol = (col + j + this.cols) % this.cols;
                const cell = this.grid[newRow][newCol];
                
                if(cell.rule === 'evolution' && cell.state > 0) {
                    totalFitness += cell.state;
                    count++;
                }
            }
        }
        
        return count > 0 ? totalFitness / count : 1;
    }

    getDNAComplement(base) {
        // A-T, G-C base pairing
        const complements = {1: 2, 2: 1, 3: 4, 4: 3}; // A-T, T-A, G-C, C-G
        return complements[base] || 1;
    }

    // Essential methods for painting, drawing, and interaction
    paintCell(x, y, rule, brushSize) {
        const centerCol = Math.floor(x / this.cellSize);
        const centerRow = Math.floor(y / this.cellSize);
        const radius = Math.floor(brushSize / 2);
        
        for(let i = -radius; i <= radius; i++) {
            for(let j = -radius; j <= radius; j++) {
                const row = centerRow + i;
                const col = centerCol + j;
                
                if(this.isValidPosition(row, col)) {
                    // Special initialization for different CA types
                    let state = 1;
                    
                    switch(rule) {
                        case 'wireworld':
                            state = Math.random() < 0.7 ? 1 : 2; // Mostly copper, some electron heads
                            break;
                        case 'forestfire':
                            state = Math.random() < 0.8 ? 1 : 0; // Mostly trees
                            break;
                        case 'cyclic':
                            state = Math.floor(Math.random() * 4) + 1; // Random cyclic state
                            break;
                        case 'antcolony':
                            state = Math.random() < 0.3 ? 1 : (Math.random() < 0.5 ? 2 : 0); // Ants and pheromones
                            break;
                        case 'dna':
                            state = Math.floor(Math.random() * 4) + 1; // Random DNA base
                            break;
                        case 'immune':
                            state = Math.random() < 0.7 ? 1 : 2; // Mostly pathogens, some T-cells
                            break;
                        case 'evolution':
                            state = Math.floor(Math.random() * 4) + 1; // Random fitness level
                            break;
                        case 'virus':
                        case 'bacteria':
                        case 'cancer':
                            // Biological CA start with small clusters
                            if(Math.sqrt(i*i + j*j) <= radius * 0.5) {
                                state = 1;
                            } else {
                                continue; // Skip outer cells for concentrated start
                            }
                            break;
                        default:
                            state = 1;
                    }
                    
                    this.grid[row][col] = {
                        state: state,
                        rule: rule,
                        age: 0,
                        strength: 1
                    };
                }
            }
        }
    }

    eraseCell(x, y, brushSize) {
        const centerCol = Math.floor(x / this.cellSize);
        const centerRow = Math.floor(y / this.cellSize);
        const radius = Math.floor(brushSize / 2);
        
        for(let i = -radius; i <= radius; i++) {
            for(let j = -radius; j <= radius; j++) {
                const row = centerRow + i;
                const col = centerCol + j;
                
                if(this.isValidPosition(row, col)) {
                    this.grid[row][col] = {
                        state: 0,
                        rule: null,
                        age: 0,
                        strength: 1
                    };
                }
            }
        }
    }

    createInvasionPattern(x, y, rule) {
        // Create larger invasion patterns for biological CA
        const centerCol = Math.floor(x / this.cellSize);
        const centerRow = Math.floor(y / this.cellSize);
        const size = 15; // Larger invasion size
        
        for(let i = -size; i <= size; i++) {
            for(let j = -size; j <= size; j++) {
                const row = centerRow + i;
                const col = centerCol + j;
                
                if(this.isValidPosition(row, col)) {
                    const distance = Math.sqrt(i*i + j*j);
                    
                    if(distance <= size) {
                        let state = 1;
                        let probability = 1 - (distance / size); // Higher density at center
                        
                        if(Math.random() < probability) {
                            switch(rule) {
                                case 'virus':
                                case 'bacteria':
                                case 'cancer':
                                    // Create dense biological clusters
                                    state = 1;
                                    break;
                                case 'antcolony':
                                    state = Math.random() < 0.4 ? 1 : 2; // Ants and pheromones
                                    break;
                                case 'dna':
                                    state = Math.floor(Math.random() * 4) + 1;
                                    break;
                                case 'evolution':
                                    state = Math.floor(Math.random() * 3) + 2; // Higher fitness
                                    break;
                                default:
                                    state = 1;
                            }
                            
                            this.grid[row][col] = {
                                state: state,
                                rule: rule,
                                age: 0,
                                strength: 1.5 // Invasion patterns are stronger
                            };
                        }
                    }
                }
            }
        }
    }

    draw(ctx) {
        ctx.clearRect(0, 0, this.width, this.height);
        
        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.cols; j++) {
                const cell = this.grid[i][j];
                if(cell.state > 0 && cell.rule) {
                    const color = this.getCellColor(cell.rule, cell.state);
                    if(color) {
                        ctx.fillStyle = color;
                        ctx.fillRect(j * this.cellSize, i * this.cellSize, this.cellSize, this.cellSize);
                    }
                }
            }
        }
        
        // Draw Langton's ants
        this.ants.forEach(ant => {
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(ant.col * this.cellSize, ant.row * this.cellSize, this.cellSize, this.cellSize);
        });
    }

    getCellColor(rule, state) {
        const colorMap = {
            'gameoflife': {1: '#00ff00'},
            'rule30': {1: '#ff0000'},
            'rule110': {1: '#0000ff'},
            'rule90': {1: '#ffff00'},
            'langton': {1: '#000000'},
            'brain': {1: '#ff0000', 2: '#ffff00'},
            'seeds': {1: '#ffff00'},
            'wireworld': {1: '#ffa500', 2: '#0000ff', 3: '#ff0000'},
            'forestfire': {1: '#00ff00', 2: '#ff0000'},
            'maze': {1: '#000000'},
            // Life-like CA colors
            'highlife': {1: '#00ff88'},
            'daynight': {1: '#4169e1'},
            'replicator': {1: '#ff1493'},
            'lifewithoutdeath': {1: '#32cd32'},
            'twobytwo': {1: '#ff6347'},
            'morley': {1: '#9370db'},
            'vote': {1: '#1e90ff'},
            'coral': {1: '#ff7f50'},
            'cyclic': {1: '#ff0000', 2: '#00ff00', 3: '#0000ff', 4: '#ffff00'},
            'anneal': {1: '#ffd700'},
            // Elementary CA colors
            'rule54': {1: '#ff69b4'},
            'rule60': {1: '#00ced1'},
            'rule102': {1: '#ff4500'},
            'rule126': {1: '#9932cc'},
            'rule150': {1: '#228b22'},
            'rule184': {1: '#dc143c'},
            'rule190': {1: '#00bfff'},
            'rule250': {1: '#ffa500'},
            // Generations family
            'generations': {1: '#ff0000', 2: '#ffff00'},
            'starwars': {1: '#ff0000', 2: '#ffff00', 3: '#ff8c00'},
            // More Life-like CA
            'diamoeba': {1: '#40e0d0'},
            'gnarl': {1: '#8b008b'},
            'dotlife': {1: '#00ff7f'},
            'pedestrian': {1: '#4682b4'},
            'stains': {1: '#8b4513'},
            'coagulations': {1: '#cd5c5c'},
            'worms': {1: '#9acd32'},
            'bugs': {1: '#ff6347'},
            // Creative & Unique CA
            'bbm': {1: '#ffd700'}, // Gold for billiard balls
            'hppgas': {1: '#87ceeb', 2: '#4169e1', 3: '#0000cd', 4: '#191970'}, // Sky blue to navy
            'critters': {1: '#ff1493'}, // Deep pink
            'stringthing': {1: '#dda0dd'}, // Plum
            'swapdiag': {1: '#20b2aa'}, // Light sea green
            'tron': {1: '#00ffff'}, // Cyan
            'sand': {1: '#f4a460'}, // Sandy brown
            'bouncygas': {1: '#ff69b4', 2: '#ff1493', 3: '#c71585', 4: '#8b008b'}, // Pink to purple
            // Experimental & Artistic CA
            'liquid': {1: '#4169e1'}, // Royal blue
            'crystal': {1: '#e0e0e0', 2: '#c0c0c0', 3: '#a0a0a0'}, // Silver shades
            'plasma': {1: '#ff00ff', 2: '#ff69b4', 3: '#ff1493', 4: '#c71585'}, // Magenta to deep pink
            'fabric': {1: '#8b4513', 2: '#daa520', 3: '#cd853f'}, // Brown, goldenrod, peru
            'neural': {1: '#9370db', 2: '#8a2be2', 3: '#9932cc', 4: '#8b008b'}, // Purple shades
            'quantum': {1: '#00ffff', 2: '#40e0d0', 3: '#48d1cc', 4: '#20b2aa'}, // Cyan to teal
            'magnetic': {1: '#ff0000', 2: '#0000ff'}, // Red north, blue south
            'gravity': {1: '#ffd700'}, // Gold particles
            'chemistry': {1: '#ff0000', 2: '#00ff00', 3: '#0000ff'}, // Red A, green B, blue product
            'ecosystem': {1: '#00ff00', 2: '#ff0000'}, // Green prey, red predator
            'music': {1: '#ff0000', 2: '#ff8000', 3: '#ffff00', 4: '#00ff00'}, // Musical spectrum
            'fractal': {1: '#ff0000', 2: '#ff8000', 3: '#ffff00', 4: '#00ff00'}, // Fractal colors
            'kaleidoscope': {1: '#ff0080', 2: '#8000ff', 3: '#00ff80', 4: '#ff8000'}, // Rose, violet, spring green, dark orange
            'aurora': {1: '#00ff7f', 2: '#00ffff', 3: '#9370db', 4: '#ff69b4'}, // Spring green, cyan, medium purple, hot pink
            'lightning': {1: '#ffff00', 2: '#ffffff', 3: '#e6e6fa', 4: '#f0f8ff'}, // Yellow, white, lavender, alice blue
            // BIOLOGICAL & SELF-REPLICATING CA COLORS
            'virus': {1: '#8b0000'}, // Dark red - dangerous virus
            'bacteria': {1: '#228b22'}, // Forest green - bacterial colonies
            'mitosis': {1: '#ff1493'}, // Deep pink - cell division
            'cancer': {1: '#4b0082'}, // Indigo - malignant growth
            'slimemold': {1: '#daa520'}, // Goldenrod - slime mold
            'antcolony': {1: '#8b4513', 2: '#cd853f', 3: '#f4a460'}, // Saddle brown ants, sandy brown pheromone, sandy brown food
            'flocking': {1: '#87ceeb'}, // Sky blue - birds in flight
            'schooling': {1: '#4682b4'}, // Steel blue - fish school
            'mycelium': {1: '#f5deb3'}, // Wheat - fungal networks
            'evolution': {1: '#ff6347', 2: '#ff7f50', 3: '#ffa500', 4: '#ff4500'}, // Tomato to orange red - fitness levels
            'dna': {1: '#ff0000', 2: '#00ff00', 3: '#0000ff', 4: '#ffff00'}, // Red A, Green T, Blue G, Yellow C
            'immune': {1: '#dc143c', 2: '#00ff00', 3: '#0000ff', 4: '#ffff00'}, // Crimson pathogen, green T-cell, blue B-cell, yellow antibody
            'neuron': {1: '#9370db'}, // Medium purple - neural networks
            'roots': {1: '#8b4513'}, // Saddle brown - root systems
            'algae': {1: '#00ff7f'} // Spring green - algae bloom
        };
        
        return colorMap[rule] && colorMap[rule][state] ? colorMap[rule][state] : '#ffffff';
    }

    // Helper methods
    isValidPosition(row, col) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }

    countNeighbors(row, col, rule, state) {
        let count = 0;
        for(let i = -1; i <= 1; i++) {
            for(let j = -1; j <= 1; j++) {
                if(i === 0 && j === 0) continue;
                
                const newRow = (row + i + this.rows) % this.rows;
                const newCol = (col + j + this.cols) % this.cols;
                const cell = this.grid[newRow][newCol];
                
                if(cell.rule === rule && cell.state === state) {
                    count++;
                }
            }
        }
        return count;
    }

    getCellState(row, col, rule) {
        if(row < 0 || row >= this.rows || col < 0 || col >= this.cols) return 0;
        const cell = this.grid[row][col];
        return (cell.rule === rule) ? cell.state : 0;
    }

    getRuleLookup(ruleNumber) {
        const lookup = [];
        for(let i = 0; i < 8; i++) {
            lookup[i] = (ruleNumber >> i) & 1;
        }
        return lookup;
    }

    updateAnts() {
        // Langton's ant logic
        this.ants.forEach(ant => {
            const cell = this.grid[ant.row][ant.col];
            
            if(cell.state === 0) {
                // Turn right, flip color, move forward
                ant.direction = (ant.direction + 1) % 4;
                this.grid[ant.row][ant.col].state = 1;
                this.grid[ant.row][ant.col].rule = 'langton';
            } else {
                // Turn left, flip color, move forward
                ant.direction = (ant.direction + 3) % 4;
                this.grid[ant.row][ant.col].state = 0;
            }
            
            // Move forward
            const directions = [{dx: 0, dy: -1}, {dx: 1, dy: 0}, {dx: 0, dy: 1}, {dx: -1, dy: 0}];
            const dir = directions[ant.direction];
            ant.row = (ant.row + dir.dy + this.rows) % this.rows;
            ant.col = (ant.col + dir.dx + this.cols) % this.cols;
        });
    }

    toggleInteractionMode() {
        this.interactionMode = !this.interactionMode;
        return this.interactionMode;
    }

    toggleBattleMode() {
        this.battleMode = !this.battleMode;
        return this.battleMode;
    }
}

class CAManager {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.isRunning = true;
        this.fps = 10;
        this.lastTime = 0;
        
        // Brush properties
        this.brushSize = 3;
        this.brushMode = 'paint'; // 'paint' or 'erase'
        this.isDrawing = false;
        this.lastDrawPos = null;
        this.mousePos = {x: 0, y: 0}; // Track mouse position for cursor
        
        // Create global grid
        this.cellSize = 4;
        this.globalGrid = new GlobalGrid(window.innerWidth, window.innerHeight, this.cellSize);
        
        this.setupCanvas();
        this.setupControls();
        this.gameLoop();
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.globalGrid = new GlobalGrid(window.innerWidth, window.innerHeight, this.cellSize);
        });
        
        // Mouse events for brush functionality
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDrawing = true;
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.lastDrawPos = {x, y};
            this.drawWithBrush(x, y);
            e.preventDefault(); // Prevent text selection
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Update mouse position for cursor
            this.mousePos = {x, y};
            this.updateBrushCursor(e);
            
            if (this.isDrawing) {
                // Draw line from last position to current position for smooth brush
                if (this.lastDrawPos) {
                    this.drawBrushLine(this.lastDrawPos.x, this.lastDrawPos.y, x, y);
                }
                this.lastDrawPos = {x, y};
            }
        });
        
        this.canvas.addEventListener('mouseup', () => {
            this.isDrawing = false;
            this.lastDrawPos = null;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.isDrawing = false;
            this.lastDrawPos = null;
            document.body.classList.remove('brush-cursor');
        });
        
        // Update brush cursor
        this.canvas.addEventListener('mouseenter', () => {
            document.body.classList.add('brush-cursor');
        });
        
        // Prevent context menu on right click
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        // Right click for eraser mode
        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 2) { // Right click
                const previousMode = this.brushMode;
                this.brushMode = 'erase';
                this.isDrawing = true;
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.lastDrawPos = {x, y};
                this.drawWithBrush(x, y);
                
                // Return to previous mode on mouse up
                const onMouseUp = () => {
                    this.brushMode = previousMode;
                    this.isDrawing = false;
                    this.lastDrawPos = null;
                    document.removeEventListener('mouseup', onMouseUp);
                };
                document.addEventListener('mouseup', onMouseUp);
                
                e.preventDefault();
            }
        });
        
        // Double-click for invasion patterns
        this.canvas.addEventListener('dblclick', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const caSelect = document.getElementById('ca-select');
            this.globalGrid.createInvasionPattern(x, y, caSelect.value);
        });
    }

    setupControls() {
        const spawnBtn = document.getElementById('spawn-btn');
        const playPauseBtn = document.getElementById('play-pause-btn');
        const clearBtn = document.getElementById('clear-btn');
        const stepBtn = document.getElementById('step-btn');
        const speedSlider = document.getElementById('speed-slider');
        const speedValue = document.getElementById('speed-value');
        
        // Brush controls
        const brushSize = document.getElementById('brush-size');
        const brushSizeValue = document.getElementById('brush-size-value');
        const brushModeBtn = document.getElementById('brush-mode-btn');
        const eraserModeBtn = document.getElementById('eraser-mode-btn');
        
        spawnBtn.addEventListener('click', () => {
            // Create a random pattern somewhere on screen
            this.spawnRandomPattern();
        });
        
        playPauseBtn.addEventListener('click', () => {
            this.isRunning = !this.isRunning;
            playPauseBtn.textContent = this.isRunning ? 'Pause' : 'Play';
        });
        
        clearBtn.addEventListener('click', () => {
            this.globalGrid = new GlobalGrid(window.innerWidth, window.innerHeight, this.cellSize);
            this.updateActiveCount();
        });
        
        stepBtn.addEventListener('click', () => {
            if(!this.isRunning) {
                this.globalGrid.update();
            }
        });
        
        speedSlider.addEventListener('input', (e) => {
            this.fps = parseInt(e.target.value);
            speedValue.textContent = `${this.fps} FPS`;
        });
        
        // Brush controls
        brushSize.addEventListener('input', (e) => {
            this.brushSize = parseInt(e.target.value);
            brushSizeValue.textContent = `${this.brushSize}px`;
            // Update cursor size immediately
            this.updateBrushCursorSize();
        });
        
        brushModeBtn.addEventListener('click', () => {
            this.brushMode = 'paint';
            brushModeBtn.classList.add('active');
            eraserModeBtn.classList.remove('active');
            this.updateBrushCursorColor();
        });
        
        eraserModeBtn.addEventListener('click', () => {
            this.brushMode = 'erase';
            eraserModeBtn.classList.add('active');
            brushModeBtn.classList.remove('active');
            this.updateBrushCursorColor();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
                case 'b':
                    // Toggle brush/eraser
                    if(this.brushMode === 'paint') {
                        eraserModeBtn.click();
                    } else {
                        brushModeBtn.click();
                    }
                    break;
                case ' ':
                    // Space to pause/play
                    playPauseBtn.click();
                    e.preventDefault();
                    break;
                case 'c':
                    // Clear all
                    if(e.ctrlKey || e.metaKey) {
                        clearBtn.click();
                        e.preventDefault();
                    }
                    break;
                case '[':
                    // Decrease brush size
                    if(this.brushSize > 1) {
                        this.brushSize--;
                        brushSize.value = this.brushSize;
                        brushSizeValue.textContent = `${this.brushSize}px`;
                        this.updateBrushCursorSize();
                    }
                    break;
                case ']':
                    // Increase brush size
                    if(this.brushSize < 20) {
                        this.brushSize++;
                        brushSize.value = this.brushSize;
                        brushSizeValue.textContent = `${this.brushSize}px`;
                        this.updateBrushCursorSize();
                    }
                    break;
            }
        });
        
        // Interaction controls
        const interactionBtn = document.getElementById('interaction-btn');
        const battleBtn = document.getElementById('battle-btn');
        const invasionBtn = document.getElementById('invasion-btn');
        
        if(interactionBtn) {
            interactionBtn.addEventListener('click', () => {
                const isEnabled = this.globalGrid.toggleInteractionMode();
                interactionBtn.textContent = isEnabled ? 'Interactions: ON' : 'Interactions: OFF';
                interactionBtn.classList.toggle('active', isEnabled);
            });
        }
        
        if(battleBtn) {
            battleBtn.addEventListener('click', () => {
                const isEnabled = this.globalGrid.toggleBattleMode();
                battleBtn.textContent = isEnabled ? 'Battle: ON' : 'Battle: OFF';
                battleBtn.classList.toggle('active', isEnabled);
            });
        }
        
        if(invasionBtn) {
            invasionBtn.addEventListener('click', () => {
                this.createInvasionPattern();
            });
        }
    }

    drawBrushLine(x1, y1, x2, y2) {
        // Calculate distance between points
        const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const steps = Math.max(1, Math.ceil(dist / (this.cellSize / 2))); // More steps for smoother lines
        
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = x1 + (x2 - x1) * t;
            const y = y1 + (y2 - y1) * t;
            this.drawWithBrush(x, y);
        }
    }

    drawWithBrush(x, y) {
        const caSelect = document.getElementById('ca-select');
        const selectedRule = caSelect.value;
        
        if (this.brushMode === 'paint') {
            this.globalGrid.paintCell(x, y, selectedRule, this.brushSize);
        } else {
            this.globalGrid.eraseCell(x, y, this.brushSize);
        }
    }

    spawnRandomPattern() {
        const caSelect = document.getElementById('ca-select');
        const selectedRule = caSelect.value;
        
        // Create a random pattern
        const centerX = Math.random() * this.canvas.width;
        const centerY = Math.random() * this.canvas.height;
        const size = 10 + Math.random() * 20;
        
        for(let i = 0; i < size; i++) {
            const angle = (i / size) * Math.PI * 2;
            const radius = Math.random() * 50;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            this.globalGrid.paintCell(x, y, selectedRule, 2);
        }
    }

    updateBrushCursor(e) {
        // Update brush cursor position and size
        this.updateBrushCursorSize();
        this.updateBrushCursorColor();
        
        const style = document.documentElement.style;
        style.setProperty('--mouse-x', `${e.clientX}px`);
        style.setProperty('--mouse-y', `${e.clientY}px`);
    }

    updateBrushCursorSize() {
        const style = document.documentElement.style;
        // Make cursor size match actual brush size accurately (1 brush size = 1 cell)
        const cursorSize = this.brushSize * this.cellSize;
        style.setProperty('--brush-size', `${cursorSize}px`);
    }

    updateBrushCursorColor() {
        const style = document.documentElement.style;
        if (this.brushMode === 'paint') {
            style.setProperty('--brush-color', '#00ff88');
        } else {
            style.setProperty('--brush-color', '#ff4444');
        }
    }

    createInvasionPattern() {
        const caSelect = document.getElementById('ca-select');
        const selectedRule = caSelect.value;
        
        // Create invasion pattern at random location
        const x = Math.random() * this.canvas.width;
        const y = Math.random() * this.canvas.height;
        
        this.globalGrid.createInvasionPattern(x, y, selectedRule);
    }

    update() {
        this.globalGrid.update();
    }

    draw() {
        this.globalGrid.draw(this.ctx);
        
        // Draw brush preview when not drawing
        if (!this.isDrawing && document.body.classList.contains('brush-cursor')) {
            this.drawBrushPreview();
        }
    }

    drawBrushPreview() {
        const rect = this.canvas.getBoundingClientRect();
        if (this.mousePos.x >= 0 && this.mousePos.x <= rect.width && 
            this.mousePos.y >= 0 && this.mousePos.y <= rect.height) {
            
            this.ctx.save();
            this.ctx.globalAlpha = 0.3;
            this.ctx.strokeStyle = this.brushMode === 'paint' ? '#00ff88' : '#ff4444';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            
            // Draw square brush preview instead of circle
            const brushPixelSize = this.brushSize * this.cellSize;
            const halfSize = brushPixelSize / 2;
            
            this.ctx.beginPath();
            this.ctx.rect(
                this.mousePos.x - halfSize, 
                this.mousePos.y - halfSize, 
                brushPixelSize, 
                brushPixelSize
            );
            this.ctx.stroke();
            this.ctx.restore();
        }
    }

    updateActiveCount() {
        // Count active cells
        let activeCount = 0;
        const rules = {};
        
        for(let i = 0; i < this.globalGrid.rows; i++) {
            for(let j = 0; j < this.globalGrid.cols; j++) {
                const cell = this.globalGrid.grid[i][j];
                if(cell.state > 0 && cell.rule) {
                    activeCount++;
                    rules[cell.rule] = (rules[cell.rule] || 0) + 1;
                }
            }
        }
        
        // Show detailed count
        let countText = `Active Cells: ${activeCount}`;
        const ruleNames = Object.keys(rules);
        if (ruleNames.length > 0) {
            countText += ` (${ruleNames.length} CA types)`;
        }
        
        document.getElementById('active-cas').textContent = countText;
    }

    gameLoop(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        const targetTime = 1000 / this.fps;
        
        if(deltaTime >= targetTime) {
            if(this.isRunning) {
                this.update();
            }
            this.draw();
            this.updateActiveCount();
            this.lastTime = currentTime;
        }
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CAManager();
}); 