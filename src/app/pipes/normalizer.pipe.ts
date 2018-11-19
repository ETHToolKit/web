import { Pipe, PipeTransform } from '@angular/core';
import BigNumber from 'bignumber.js';

@Pipe({ name: 'num' })
export class NormalizerPipe implements PipeTransform {
    transform(value:BigNumber, decimals:any):string {
        if(value == undefined || value == null)
            return "";
        if(decimals == 0 || decimals == null || decimals == undefined)
            return value.toFormat(2);
        else
            return value.dividedBy(new BigNumber(10).pow(decimals)).toFormat(2);
        
    }
}