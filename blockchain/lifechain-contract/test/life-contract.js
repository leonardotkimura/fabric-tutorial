/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { LifeContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logger = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('LifeContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new LifeContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"life 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"life 1002 value"}'));
    });

    describe('#lifeExists', () => {

        it('should return true for a life', async () => {
            await contract.lifeExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a life that does not exist', async () => {
            await contract.lifeExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createLife', () => {

        it('should create a life', async () => {
            await contract.createLife(ctx, '1003', 'life 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"life 1003 value"}'));
        });

        it('should throw an error for a life that already exists', async () => {
            await contract.createLife(ctx, '1001', 'myvalue').should.be.rejectedWith(/The life 1001 already exists/);
        });

    });

    describe('#readLife', () => {

        it('should return a life', async () => {
            await contract.readLife(ctx, '1001').should.eventually.deep.equal({ value: 'life 1001 value' });
        });

        it('should throw an error for a life that does not exist', async () => {
            await contract.readLife(ctx, '1003').should.be.rejectedWith(/The life 1003 does not exist/);
        });

    });

    describe('#updateLife', () => {

        it('should update a life', async () => {
            await contract.updateLife(ctx, '1001', 'life 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"life 1001 new value"}'));
        });

        it('should throw an error for a life that does not exist', async () => {
            await contract.updateLife(ctx, '1003', 'life 1003 new value').should.be.rejectedWith(/The life 1003 does not exist/);
        });

    });

    describe('#deleteLife', () => {

        it('should delete a life', async () => {
            await contract.deleteLife(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a life that does not exist', async () => {
            await contract.deleteLife(ctx, '1003').should.be.rejectedWith(/The life 1003 does not exist/);
        });

    });

});
