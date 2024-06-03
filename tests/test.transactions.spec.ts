import { test, beforeAll, afterAll, describe, expect } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

describe('Transactions routes', () => {

    beforeAll(async () => {
    await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    test('User should be able to create a new transaction', async () => {
        await request(app.server)
            .post('/transactions')
            .send({
                title: 'Teste',
                amount: 100,
                type: 'credit'
            })
            .expect(201)
    })

    test('User should be able to list your transactions', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'Teste',
                amount: 100,
                type: 'credit'
            })

        const cookies = createTransactionResponse.get('Set-Cookie') || []

        const listTransactionsResponse = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200)

        expect(listTransactionsResponse.body.transactions).toEqual([
            expect.objectContaining({
                title: 'Teste',
                amount: 100,
            })
        ])
    })
})