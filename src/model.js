class model {
    constructor() {
        this.features = {};
        this.initializeDefaultFeatures();
        this.debugMode = false;
    }

    initializeDefaultFeatures() {
        this.setLife(100);
        this.setScore(0);
        this.setCollisionState(false);
        this.setPowerUps([]);
        this.setGameState('playing');
    }

    setLife(value) {
        this.features.life = value;
    }

    setScore(value) {
        this.features.score = value;
    }

    setCollisionState(value) {
        this.features.collisionState = value;
    }

    setPowerUps(value) {
        this.features.powerUps = value;
    }

    setGameState(value) {
        this.features.gameState = value;
    }

    getFeature(featureName) {
        return this.features[featureName];
    }

    getAllFeatures() {
        return this.features;
    }

    toggleDebugMode() {
        this.debugMode = !this.debugMode;
        console.log(`Debug mode ${this.debugMode ? 'enabled' : 'disabled'}`);
    }

    debugLog() {
        if (this.debugMode) {
            console.log('Player Debug Info:');
            console.log(JSON.stringify(this.features, null, 2));
        }
    }
}

