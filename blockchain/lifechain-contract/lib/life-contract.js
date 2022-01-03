/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class LifeContract extends Contract {

    async lifeExists(ctx, lifeId) {
        const buffer = await ctx.stub.getState(lifeId);
        return (!!buffer && buffer.length > 0);
    }

    async createLife(ctx, lifeId, value) {
        const exists = await this.lifeExists(ctx, lifeId);
        if (exists) {
            throw new Error(`The life ${lifeId} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(lifeId, buffer);
        return asset
    }

    async readLife(ctx, lifeId) {
        const exists = await this.lifeExists(ctx, lifeId);
        if (!exists) {
            throw new Error(`The life ${lifeId} does not exist`);
        }
        const buffer = await ctx.stub.getState(lifeId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateLife(ctx, lifeId, newValue) {
        const exists = await this.lifeExists(ctx, lifeId);
        if (!exists) {
            throw new Error(`The life ${lifeId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(lifeId, buffer);
    }

    async deleteLife(ctx, lifeId) {
        const exists = await this.lifeExists(ctx, lifeId);
        if (!exists) {
            throw new Error(`The life ${lifeId} does not exist`);
        }
        await ctx.stub.deleteState(lifeId);
    }

}

module.exports = LifeContract;
