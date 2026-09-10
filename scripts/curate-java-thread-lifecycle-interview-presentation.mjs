#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const contentPath = path.join(
  repoRoot,
  "content/java-backend-fresher/java-multithreading-basics/thread-lifecycle/complete-qa.json",
);
const beats = [
  {
    cue: "Name the complete Java state model",
    stage: "The six thread states",
    spokenText:
      "Java exposes six thread states in `Thread.State`: `NEW`, `RUNNABLE`, `BLOCKED`, `WAITING`, `TIMED_WAITING`, and `TERMINATED`. A state is a snapshot of what a thread is doing at that moment. `RUNNABLE` includes a thread that is executing Java code and one that is ready but waiting for CPU time; Java has no separate `RUNNING` state.",
  },
  {
    cue: "Explain the main path and possible pauses",
    stage: "The lifecycle is not linear",
    spokenText:
      "A newly constructed `Thread` is `NEW`. Calling `start()` makes it eligible to execute in `RUNNABLE`. During its work, it may move into one of the three non-running states and later return to `RUNNABLE`, sometimes many times. When `run()` finishes normally or because of an uncaught exception, the thread becomes `TERMINATED` and cannot be started again.",
    support: {
      type: "trace",
      title: "One possible lifecycle path",
      items: [
        {
          label: "Created",
          value: "NEW",
          detail: "The Thread object exists, but start() has not been called.",
          tone: "blue",
        },
        {
          label: "Eligible",
          value: "RUNNABLE",
          detail: "The thread is running or ready for CPU time.",
          tone: "green",
        },
        {
          label: "Paused",
          value: "3 possible states",
          detail: "A lock, signal, or timeout can pause it before it returns to RUNNABLE.",
          tone: "orange",
        },
        {
          label: "Finished",
          value: "TERMINATED",
          detail: "run() has ended; the same Thread cannot be restarted.",
          tone: "neutral",
        },
      ],
    },
  },
  {
    cue: "Separate the three non-running states",
    stage: "Three different pauses",
    spokenText:
      "`BLOCKED` means the thread is waiting to enter or re-enter a `synchronized` region because another thread owns that monitor. `WAITING` is an indefinite wait caused by calls such as `Object.wait()`, `Thread.join()`, or `LockSupport.park()`. `TIMED_WAITING` has a deadline, as with `Thread.sleep(500)`, `Object.wait(500)`, or `Thread.join(500)`. The names look similar, but each points to a different cause.",
  },
  {
    cue: "Connect the states to real diagnosis",
    stage: "What the states reveal",
    spokenText:
      "In practice, `Thread.getState()` and thread dumps use these same state names. Many `BLOCKED` threads can point to lock contention, while unexpected `WAITING` threads can point to coordination that never completed. The value can change immediately after it is read, so I treat it as a clue and check the stack trace, lock owner, and repeated samples before deciding the cause.",
    recallRule:
      "Remember `NEW → RUNNABLE → TERMINATED` as the main path, with `BLOCKED`, `WAITING`, and `TIMED_WAITING` as possible pauses.",
  },
];

const presentations = {
  "java-thread-lifecycle-states": {
    answerSize: "standard",
    beats,
  },
  "blocked-vs-waiting-thread-state": {
    answerSize: "standard",
    beats: [
      {
        cue: "Define the difference by its cause",
        stage: "Two different reasons to wait",
        spokenText:
          "`BLOCKED` and `WAITING` both mean a thread is not executing, but the reason is different. A `BLOCKED` thread is trying to acquire an intrinsic monitor for a `synchronized` region. A `WAITING` thread has paused indefinitely until another action occurs. This difference tells you whether to inspect lock contention or coordination logic.",
        support: {
          type: "comparison",
          title: "The difference at a glance",
          items: [
            {
              label: "BLOCKED",
              value: "needs a monitor",
              detail: "The thread wants to enter or re-enter synchronized code, but another thread owns the monitor.",
              tone: "orange",
            },
            {
              label: "WAITING",
              value: "needs an event",
              detail: "The thread used wait(), join(), or park() with no timeout; the event that resumes it depends on that operation.",
              tone: "blue",
            },
          ],
        },
      },
      {
        cue: "Explain monitor contention precisely",
        stage: "Why BLOCKED happens",
        spokenText:
          "Suppose thread A is inside `synchronized (lock)`. Thread B becomes `BLOCKED` if it tries to enter code guarded by the same monitor. Thread B did not call a waiting method and does not own the monitor. It can continue only after the monitor becomes available and the JVM grants it ownership.",
      },
      {
        cue: "Separate the operations that cause waiting",
        stage: "What WAITING actually means",
        spokenText:
          "`WAITING` can be caused by `lock.wait()`, `worker.join()`, or `LockSupport.park()`, but they do not resume in exactly the same way. `wait()` can end through notification, interruption, or a spurious wake-up; `join()` completes when the target thread terminates; and `park()` can be released with `unpark()`. Only `Object.wait()` releases the monitor on which it is called.",
      },
      {
        cue: "Explain reacquisition and diagnosis",
        stage: "Notification is not the end",
        spokenText:
          "After `notify()` selects a thread waiting on that object, the notified thread still must reacquire the same monitor before `wait()` can return. It may therefore appear `BLOCKED` while the notifying thread keeps the lock. In a thread dump, many `BLOCKED` threads suggest monitor contention; long-lived `WAITING` threads require checking the exact wait operation and what should complete it.",
        recallRule:
          "`BLOCKED` waits to own a monitor; `WAITING` waits indefinitely for an operation-specific event and may still need the monitor afterward.",
      },
    ],
  },
  "thread-join-in-java": {
    answerSize: "standard",
    beats: [
      {
        cue: "Define the caller and the target thread",
        stage: "join waits for termination",
        spokenText:
          "`Thread.join()` makes the current thread wait for another thread to terminate. In `worker.join()`, `worker` is the target and the thread executing that line is the caller. A no-timeout join puts the caller in `WAITING` while the target is alive; it does not pause the target or make the caller perform the target's work.",
      },
      {
        cue: "Show the useful fan-out and fan-in order",
        stage: "Start first, then join",
        spokenText:
          "Use `join()` when the next step depends on completed worker work. For an order batch, start every worker first, then run `worker.join()` for each one, and build the report only after those joins return. Starting and immediately joining one worker at a time would be correct, but it would remove the intended parallelism.",
        support: {
          type: "trace",
          title: "Parallel work followed by one dependent step",
          items: [
            {
              label: "Fan out",
              value: "start all",
              detail: "Every worker becomes eligible to run before the caller waits.",
              tone: "blue",
            },
            {
              label: "Work",
              value: "workers run",
              detail: "The order tasks can make progress at the same time.",
              tone: "green",
            },
            {
              label: "Fan in",
              value: "join each",
              detail: "The caller waits until every target thread has terminated.",
              tone: "orange",
            },
            {
              label: "Depend",
              value: "build report",
              detail: "The final step starts only after all required results are ready.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Explain the completion visibility guarantee",
        stage: "Completion makes data visible",
        spokenText:
          "A successful return from `join()` also provides a memory-visibility guarantee: every action in the worker happens-before the caller continues after the join. Results written by the worker are therefore visible to the caller. The caller may itself be interrupted while waiting, so `InterruptedException` should be propagated, or the interrupt status restored when the method cannot throw it.",
      },
      {
        cue: "State timeout and dependency boundaries",
        stage: "A timeout needs a check",
        spokenText:
          "`join(1000)` can return because the target finished or because one second elapsed; it does not return a success flag, so check `worker.isAlive()` when that distinction matters. Circular dependencies such as thread A joining B while B joins A can wait forever. For larger task workflows, `Future`, `ExecutorService`, or `CompletableFuture` usually expresses completion more directly.",
        recallRule:
          "Start independent workers first, join before consuming their results, and treat a timed join as a deadline rather than proof of completion.",
      },
    ],
  },
  "stopping-threads-safely-in-java": {
    answerSize: "standard",
    beats: [
      {
        cue: "Explain why forceful termination is unsafe",
        stage: "Why Thread.stop is unsafe",
        spokenText:
          "`Thread.stop()` is deprecated and unsafe because it can terminate a thread at an arbitrary point. As the resulting `ThreadDeath` unwinds the stack, monitors are released even if the protected object is halfway through an update. Another thread can then observe broken shared state. The stopped thread has no reliable safe boundary at which to preserve that object's rules.",
      },
      {
        cue: "Define cooperative cancellation and its choices",
        stage: "Cancellation is cooperative",
        spokenText:
          "Safe cancellation is cooperative: one thread requests a stop, and the task notices that request at a defined boundary, cleans up, and returns. The signal must match the work. A compute loop can check a `volatile` flag or its interrupt status regularly, while a task blocked in an interruptible operation normally needs `interrupt()` so it can wake promptly.",
        support: {
          type: "comparison",
          title: "Match the request to the kind of work",
          items: [
            {
              label: "Compute loop",
              value: "flag or interrupt",
              detail: "Check the request regularly and leave through a cleanup path.",
              tone: "blue",
            },
            {
              label: "Blocking task",
              value: "interrupt",
              detail: "Wake an interruptible sleep, wait, join, or queue operation.",
              tone: "green",
            },
            {
              label: "Executor task",
              value: "cancel(true)",
              detail: "Request interruption through the task API; the task must still cooperate.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Explain what interruption actually does",
        stage: "Interrupt is a request",
        spokenText:
          "`interrupt()` does not kill a running thread. It sets the interrupted status; if the thread is in `sleep()`, `wait()`, `join()`, or an interruptible queue call, that operation throws `InterruptedException` and clears the status. Code normally propagates the exception or returns after cleanup. If a catch layer cannot propagate it and another layer must observe it, call `Thread.currentThread().interrupt()` to restore the status.",
      },
      {
        cue: "Close with cancellation policy boundaries",
        stage: "A stop request needs a policy",
        spokenText:
          "A `volatile` flag alone cannot wake a thread blocked in `sleep()`, `wait()`, or `BlockingQueue.take()`. Higher-level calls such as `Future.cancel(true)` and `ExecutorService.shutdownNow()` also request interruption; they do not force arbitrary code to stop. A complete cancellation policy says where the task checks the request, how partial work is handled, and which resources must be released.",
        recallRule:
          "Never force a Java thread to stop; request cancellation cooperatively, let the task stop at a safe boundary, and match interruption handling to the work.",
      },
    ],
  },
};

const document = JSON.parse(fs.readFileSync(contentPath, "utf8"));
const questions = Array.isArray(document) ? document : document.questions;

for (const [targetSlug, presentation] of Object.entries(presentations)) {
  const matches = questions.filter((question) => question.slug === targetSlug);
  if (matches.length !== 1) {
    throw new Error(`Expected exactly one ${targetSlug} question; found ${matches.length}.`);
  }

  const speakableSections = matches[0].answer?.sections?.filter(
    (section) => section.type === "speakable_answer",
  ) ?? [];
  if (speakableSections.length !== 1) {
    throw new Error(
      `Expected exactly one speakable_answer section for ${targetSlug}; found ${speakableSections.length}.`,
    );
  }

  const speakable = speakableSections[0];
  speakable.title = "Interview answer";
  speakable.answerSize = presentation.answerSize;
  speakable.beats = presentation.beats;
  speakable.content = presentation.beats
    .map((beat) => beat.spokenText)
    .join("\n\n");
}

fs.writeFileSync(contentPath, `${JSON.stringify(document, null, 2)}\n`);
console.log(`Curated Interview Answer presentation for ${Object.keys(presentations).length} lifecycle questions.`);
