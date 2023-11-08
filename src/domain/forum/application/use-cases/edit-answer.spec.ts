import { EditAnswerUseCase } from "./edit-answer";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";

import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { makeAnswer } from "test/factories/make-answer";

let sut: EditAnswerUseCase;
let inMemoryAnswersRepository: InMemoryAnswersRepository;

describe("Edit Answer Use Case", () => {
	beforeEach(() => {
		inMemoryAnswersRepository = new InMemoryAnswersRepository();

		sut = new EditAnswerUseCase(inMemoryAnswersRepository);
	});

	it("should be able to edit an answer", async () => {
		const newAnswer = makeAnswer({
			authorId: new UniqueEntityID("author-1")
		}, new UniqueEntityID("answer-1"));

		await inMemoryAnswersRepository.create(newAnswer);

		await sut.execute({
			authorId: "author-1",
			answerId: "answer-1",
			content: "Test Content"
		});
	
		expect(inMemoryAnswersRepository.items[0]).toMatchObject({
			content: "Test Content"
		});
	});

	it("should not be able to edit an answer from another user", async () => {
		const newAnswer = makeAnswer({
			authorId: new UniqueEntityID("author-1")
		}, new UniqueEntityID("answer-1"));

		await inMemoryAnswersRepository.create(newAnswer);

		expect(async () => {
			await sut.execute({
				authorId: "author-2",
				answerId: "answer-1",
				content: "Test Content"
			});
		}).rejects.toBeInstanceOf(Error);
	});
});