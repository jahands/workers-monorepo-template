import { connect } from 'itty-sockets'
import { assert, expect, test } from 'vitest'

const channelSecret = crypto.randomUUID()

function getChannel(name: string): string {
	return `jh/${channelSecret}/vitest/${name}`
}

test('send and receive messages', { timeout: 5000, retry: 3 }, async () => {
	const received: any[] = []
	let waitForFinalMessage: Promise<void> | undefined

	await new Promise((resolve) => {
		waitForFinalMessage = new Promise((resolve2) => {
			const channel = connect(getChannel('dependency-tests'), { echo: true })
				// listen for messages
				.listen((e) => {
					received.push(e.message)
					if (received.length === 4) {
						resolve(0)
					} else if (received.length === 5) {
						resolve2()
					}
				})

				// send messages
				.send('hello world')
				.send([1, 2, 3])
				.send({ foo: 'bar' })

			channel.send('hello again!')
		})
	})

	expect(received).toStrictEqual([
		'hello world',
		[1, 2, 3],
		{
			foo: 'bar',
		},
		'hello again!',
	])

	// Create another connection
	const received2: any[] = []

	await new Promise((resolve) => {
		connect(getChannel('dependency-tests'), { echo: true })
			// listen for messages
			.listen((e) => {
				received2.push(e.message)
				if (received2.length >= 1) {
					resolve(0)
				}
			})
			.send('hello from channel 2!')
	})

	assert(waitForFinalMessage !== undefined)
	await waitForFinalMessage

	expect(received).toStrictEqual([
		'hello world',
		[1, 2, 3],
		{
			foo: 'bar',
		},
		'hello again!',
		'hello from channel 2!',
	])

	expect(received2).toStrictEqual(['hello from channel 2!'])
})
