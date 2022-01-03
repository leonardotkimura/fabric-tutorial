'use strict';

const SmartContract = require('./smartContract.js');

class LifeContract extends SmartContract{
  async createLife(life){
    await this.submitTransaction('LifeContract:createLife', life.id, JSON.stringify(life))
  }

  async readLife(lifeId) {
    return await this.evaluateTransaction('LifeContract:readLife', lifeId);
  }

  async getAllLife() {
    return await this.evaluateTransaction('LifeContract:readAllLife');
  }
}

module.exports = LifeContract;
