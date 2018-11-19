import { Injectable } from '@angular/core';
import { HelperService } from './helper.service';
import { BigNumber } from 'bignumber.js';
import * as Web3 from 'web3';
import { AirdropItem } from '../models/airdropItem.model';
import { AirdropData } from '../core/airdropData';
import { EthereumService } from './ethereum.service';

@Injectable({
    providedIn: 'root'
})
export class AirdropDataService {

    constructor(
        private _helperService: HelperService) { }

    public parse(text: string, separator: string, decimals: number): AirdropData {

        var lines = text.replace(/\r/g, "\n").split('\n').filter((x)=>x.length > 0);
        var airdropItems = [];

        for (var i = 0; i < lines.length; i++) {
            var data = lines[i].split(separator);
            if (data.length == 2) {
                if (!this._helperService.isAddress(data[0])) {
                    throw data[0] + " is an invalid address."
                }
                var normalizedValue = data[1].replace(",", ".");
                var value = new BigNumber(10).pow(decimals);
                value = value.times(normalizedValue);

                airdropItems.push(new AirdropItem(data[0], normalizedValue, value, i + 1))
            }
            else {
                throw "Invalid data format."
            }
        }

        return new AirdropData(airdropItems);
    }

    public validateData() {

    }
}
