import { WebDriver as OriginalWebDriver } from 'selenium-webdriver/index'

declare module 'selenium-webdriver' {
	export interface WebDriver extends Omit<typeof OriginalWebDriver, 'wait'> {
		/**
		 * Schedules a command to wait for a condition to hold. The condition may be
		 * specified by a {@link Condition}, as a custom function, or
		 * as a {@link Promise}.
		 *
		 * For a {@link Condition} or function, the wait will repeatedly
		 * evaluate the condition until it returns a truthy value. If any errors occur
		 * while evaluating the condition, they will be allowed to propagate. In the
		 * event a condition returns a {@link Promise promise}, the
		 * polling loop will wait for it to be resolved and use the resolved value for
		 * whether the condition has been satisified. Note the resolution time for
		 * a promise is factored into whether a wait has timed out.
		 *
		 * Note, if the provided condition is a {@link WebElementCondition}, then
		 * the wait will return a {@link WebElementPromise} that will resolve to the
		 * element that satisified the condition.
		 *
		 * *Example:* waiting up to 10 seconds for an element to be present and
		 * visible on the page.
		 *
		 *     var button = driver.wait(until.elementLocated(By.id('foo'), 10000);
		 *     button.click();
		 *
		 * This function may also be used to block the command flow on the resolution
		 * of a {@link Promise promise}. When given a promise, the
		 * command will simply wait for its resolution before completing. A timeout
		 * may be provided to fail the command if the promise does not resolve before
		 * the timeout expires.
		 *
		 * *Example:* Suppose you have a function, `startTestServer`, that returns a
		 * promise for when a server is ready for requests. You can block a
		 * `WebDriver` client on this promise with:
		 *
		 *     var started = startTestServer();
		 *     driver.wait(started, 5 * 1000, 'Server should start within 5 seconds');
		 *     driver.get(getServerUrl());
		 *
		 * @param {!WebElementCondition} condition The condition to
		 *     wait on, defined as a promise, condition object, or  a function to
		 *     evaluate as a condition.
		 * @param {number=} opt_timeout How long to wait for the condition to be true.
		 * @param {string=} opt_message An optional message to use if the wait times
		 *     out.
		 * @return {!WebElementPromise} A promise that will be fulfilled
		 *     with the first truthy value returned by the condition function, or
		 *     rejected if the condition times out.
		 * @template T
		 */
		wait(condition: WebElementCondition, opt_timeout?: number, opt_message?: string, interval?: number):
		WebElementPromise;

		/**
		* Schedules a command to wait for a condition to hold. The condition may be
		* specified by a {@link webdriver.Condition}, as a custom function, or
		* as a {@link Promise}.
		*
		* For a {@link webdriver.Condition} or function, the wait will repeatedly
		* evaluate the condition until it returns a truthy value. If any errors occur
		* while evaluating the condition, they will be allowed to propagate. In the
		* event a condition returns a {@link Promise promise}, the
		* polling loop will wait for it to be resolved and use the resolved value for
		* whether the condition has been satisified. Note the resolution time for
		* a promise is factored into whether a wait has timed out.
		*
		* Note, if the provided condition is a {@link WebElementCondition}, then
		* the wait will return a {@link WebElementPromise} that will resolve to the
		* element that satisified the condition.
		*
		* *Example:* waiting up to 10 seconds for an element to be present and
		* visible on the page.
		*
		*     var button = driver.wait(until.elementLocated(By.id('foo'), 10000);
		*     button.click();
		*
		* This function may also be used to block the command flow on the resolution
		* of a {@link Promise promise}. When given a promise, the
		* command will simply wait for its resolution before completing. A timeout
		* may be provided to fail the command if the promise does not resolve before
		* the timeout expires.
		*
		* *Example:* Suppose you have a function, `startTestServer`, that returns a
		* promise for when a server is ready for requests. You can block a
		* `WebDriver` client on this promise with:
		*
		*     var started = startTestServer();
		*     driver.wait(started, 5 * 1000, 'Server should start within 5 seconds');
		*     driver.get(getServerUrl());
		*
		* @param {!(Promise<T>|
		*           Condition<T>|
		*           function(!WebDriver): T)} condition The condition to
		*     wait on, defined as a promise, condition object, or  a function to
		*     evaluate as a condition.
		* @param {number=} opt_timeout How long to wait for the condition to be true.
		* @param {string=} opt_message An optional message to use if the wait times
		*     out.
		* @return {!Promise<T>} A promise that will be fulfilled
		*     with the first truthy value returned by the condition function, or
		*     rejected if the condition times out.
		* @template T
		*/
		wait<T>(
		condition: PromiseLike<T>|Condition<T>|((driver: WebDriver) => T | PromiseLike<T>)|Function,
		opt_timeout?: number, opt_message?: string, interval?: number): Promise<T>;
	}
}
