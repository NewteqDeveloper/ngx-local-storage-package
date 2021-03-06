import { Injectable, Inject } from '@angular/core';
import { ConfigToken } from './config/config-token';
import { NgxLocalStorageConfig } from './config/ngx-local-storage-config';
import { defaultConfig } from './consts/config';

@Injectable({
	providedIn: 'root'
})
export class LocalStorageService {

	private readonly prefix: string;
	private readonly convertToFromJson: boolean;
	private readonly nullUndefinedIsSame: boolean;
	private readonly allowNullStorage: boolean;

	private readonly usePrefix: boolean;

	constructor(@Inject(ConfigToken) config?: NgxLocalStorageConfig) {
		this.prefix = config.prefix || defaultConfig.prefix;
		this.convertToFromJson = config.defaultJsonConversion || defaultConfig.defaultJsonConversion;
		this.nullUndefinedIsSame = config.nullUndefinedIsTheSame || defaultConfig.nullUndefinedIsTheSame;
		this.allowNullStorage = config.allowNullStorage || defaultConfig.allowNullStorage;

		if (this.prefix === '' || this.prefix === null || this.prefix === undefined) {
			this.usePrefix = false;
		} else {
			this.usePrefix = true;
		}
	}

	public setItem(key: string, value: any, toJson: boolean = this.convertToFromJson): boolean {
		if (!this.allowNullStorage) {
			let removeItem: boolean;
			if (this.nullUndefinedIsSame) {
				if (value === undefined || value === null) {
					removeItem = true;
				}
			} else {
				if (value === null) {
					removeItem = true;
				}
			}
			if (removeItem) {
				this.removeItem(key);
				return false;
			}
		}
		let valueToStore: any;
		if (toJson) {
			valueToStore = JSON.stringify(value);
		} else {
			valueToStore = value;
		}

		localStorage.setItem(`${this.getKey(key)}`, valueToStore);

		return true;
	}

	public getItem<T = any>(key: string, fromJson: boolean = this.convertToFromJson): T | any {
		const value = localStorage.getItem(`${this.getKey(key)}`);
		if (fromJson) {
			return <T>JSON.parse(value);
		} else {
			return value;
		}
	}

	public removeItem(key: string): void {
		localStorage.removeItem(`${this.getKey(key)}`);
	}

	public clear(): void {
		localStorage.clear();
	}

	private getKey(key: string): string {
		return this.usePrefix ? `${this.prefix}${key}` : key;
	}
}
