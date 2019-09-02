/**
 * ServiceWorker error for unsupported browsers.
 */
export interface ServiceWorkerNoSupportError extends Error {
	new(): ServiceWorkerNoSupportError;
	prototype: ServiceWorkerNoSupportError;
}

/**
 * ScriptUrl type.
 */
export type ScriptUrl = string;

/**
 * Register ServiceWorker function type.
 */
export type ServiceWorkerRegister = (options?: RegistrationOptions) => Promise<ServiceWorkerRegistration>;
