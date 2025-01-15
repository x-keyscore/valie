import { VariantCriteria, MountedCriteria, formats } from "../formats";
import { SchemaMountingTask } from "./types";
import { LibraryError } from "../utils";

function processTask(task: SchemaMountingTask) {
	const format = formats[task.definedCriteria.type];
	if (!format) throw new LibraryError(
		"Criteria mounting",
		"Format type '" + task.definedCriteria.type + "' is unknown"
	);

	format.mountCriteria(task.definedCriteria, task.mountedCriteria);
	const mountingTasks = format.getMountingTasks?.(task.definedCriteria, task.mountedCriteria);

	return ({
		mountingTasks
	});
}

export function mounter<T extends VariantCriteria>(
	definedCriteria: T
): MountedCriteria<T> {
	let mountedCriteria: MountedCriteria<T> = {} as any;
	let queue: SchemaMountingTask[] = [{ definedCriteria, mountedCriteria }];

	while (queue.length > 0) {
		const currentTask = queue.pop()!;

		const { mountingTasks } = processTask(currentTask);

		if (mountingTasks) Array.prototype.push.apply(queue, mountingTasks);
	}

	return (mountedCriteria);
};