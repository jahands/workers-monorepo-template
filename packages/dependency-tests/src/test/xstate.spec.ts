import { test } from 'vitest'
import { assign, createActor, createMachine } from 'xstate'

test('countMachine', async () => {
	const countMachine = createMachine({
		context: {
			count: 0,
		},
		on: {
			INC: {
				actions: assign({
					count: ({ context }) => context.count + 1,
				}),
			},
			DEC: {
				actions: assign({
					count: ({ context }) => context.count - 1,
				}),
			},
			SET: {
				actions: assign({
					count: ({ event }) => event.value,
				}),
			},
		},
	})

	const countActor = createActor(countMachine).start()

	countActor.subscribe((state) => {
		console.log(state.context.count)
	})

	countActor.send({ type: 'INC' })
	// logs 1
	countActor.send({ type: 'DEC' })
	// logs 0
	countActor.send({ type: 'SET', value: 10 })
	// logs 10
})

test('textMachine', async () => {
	const textMachine = createMachine({
		context: {
			committedValue: '',
			value: '',
		},
		initial: 'reading',
		states: {
			reading: {
				on: {
					'text.edit': { target: 'editing' },
				},
			},
			editing: {
				on: {
					'text.change': {
						actions: assign({
							value: ({ event }) => event.value,
						}),
					},
					'text.commit': {
						actions: assign({
							committedValue: ({ context }) => context.value,
						}),
						target: 'reading',
					},
					'text.cancel': {
						actions: assign({
							value: ({ context }) => context.committedValue,
						}),
						target: 'reading',
					},
				},
			},
		},
	})

	const textActor = createActor(textMachine).start()

	textActor.subscribe((state) => {
		console.log(state.context.value)
	})

	textActor.send({ type: 'text.edit' })
	// logs ''
	textActor.send({ type: 'text.change', value: 'Hello' })
	// logs 'Hello'
	textActor.send({ type: 'text.commit' })
	// logs 'Hello'
	textActor.send({ type: 'text.edit' })
	// logs 'Hello'
	textActor.send({ type: 'text.change', value: 'Hello world' })
	// logs 'Hello world'
	textActor.send({ type: 'text.cancel' })
	// logs 'Hello'
})
