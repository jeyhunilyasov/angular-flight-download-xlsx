import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as logoFile from './carlogo.js';
import { DatePipe } from '@angular/common';
import * as Chart from "chart.js";

@Injectable({
  providedIn: "root"
})
export class ExcelService {
  chArr = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X'];
  constructor(private datePipe: DatePipe) {}
  async downLoadExcel(data) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Car Data");
    const leftTitle = "Inbound Flights";
    const rightTitle = "Outbound Flights";
    let lengthData = this.getLengthForSheet(data);
    let leftHeaderArr = ['', '', ''];
    console.log(lengthData);
    let index =Math.ceil((lengthData[1] - 3) / 2 );
    for( let i = 0 ; i < index ; i ++ ){
      leftHeaderArr.push('');
    }
    leftHeaderArr.push(leftTitle);
    for( let i = 0 ; i < lengthData[1]-1-index ; i ++ ) {
      leftHeaderArr.push("");
    }
    leftHeaderArr.push('');
    leftHeaderArr.push('');
    leftHeaderArr.push(rightTitle);
    worksheet.addRow(leftHeaderArr);
    const firstMerge = this.chArr[leftHeaderArr.indexOf(leftTitle)] + "1" + ":" + this.chArr[leftHeaderArr.indexOf(leftTitle) +2] + '1';
    const secondMerge = this.chArr[leftHeaderArr.indexOf(rightTitle)] + "1" + ":" + this.chArr[leftHeaderArr.indexOf(rightTitle) +2] + '1';
    const thirdMerge = this.chArr[leftHeaderArr.indexOf(rightTitle)-2] + "1" + ":" + this.chArr[leftHeaderArr.indexOf(rightTitle) - 2] + '21';
    console.log(this.chArr[index+3]);
    console.log(firstMerge);
    worksheet.mergeCells(firstMerge);
    worksheet.mergeCells(secondMerge);
    worksheet.addRow([]);
    data.forEach((data,index) => {
      let time = '';
      if( Number(data[0]) > 12 ) {
        time = data[0] + ' P.M'
      } else {
        time = data[0] + ' A.M';
      }
      let leftrowData = [time];
      leftrowData.push('');
      leftrowData.push("");
      for( let i = 0 ; i < lengthData[1] - data[1]/5; i ++ ){
        leftrowData.push("");
      }
      leftrowData.push(data[1]);
      let row1 = worksheet.addRow(leftrowData);
      let firstIndex = 3 + (lengthData[1] - Number(data[1])/5);
      row1.getCell(firstIndex + 1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "f4b084" }
      };
      let leftMerge = this.chArr[firstIndex] + 3 * (index + 1) + ':' + this.chArr[firstIndex + Number(data[1])/5 - 1] +  3 * (index + 1);
      let secondIndex = 4 + ( lengthData[1]);
      let rightMerge = this.chArr[secondIndex] + ( 3 * (index + 1) + 2 ) + ':' + this.chArr[secondIndex + Number(data[2])/5 - 1] + ( 3 * (index + 1) + 2 );
      worksheet.addRow([]);
      let rightRowData = ['', '', ''];
      for(let i = 0 ; i < lengthData[1]; i ++ ){
        rightRowData.push('');
      }
      rightRowData.push('');
      rightRowData.push(data[2]);
      console.log('rightData', rightRowData);
      let row2 = worksheet.addRow(rightRowData);
      row2.getCell(secondIndex + 1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "ffc000" }
      };
      worksheet.mergeCells(leftMerge);
      worksheet.mergeCells(rightMerge);

      if( index == Math.floor(lengthData[2]/2)) {
        const thirdMerge = this.chArr[leftHeaderArr.indexOf(rightTitle)-2] + "1" + ":" + this.chArr[leftHeaderArr.indexOf(rightTitle) - 2] + (3*(index));
        worksheet.mergeCells(thirdMerge);
      }
      // worksheet.mergeCells()
    });
    console.log("third merge",thirdMerge);
    let middle = Math.floor(lengthData[2] / 2);
    const delMerge = this.chArr[leftHeaderArr.indexOf(rightTitle)-2] + (3*(middle) + 1 ) + ":" + this.chArr[leftHeaderArr.indexOf(rightTitle) - 2] + (3*(middle) + 3);
    worksheet.mergeCells(delMerge);
    const lastMerge = this.chArr[leftHeaderArr.indexOf(rightTitle)-2] + (3*(middle) + 4 ) + ":" + this.chArr[leftHeaderArr.indexOf(rightTitle) - 2] + (3*lengthData[2] + 4)
    worksheet.mergeCells(lastMerge);
    worksheet.getCell(
      this.chArr[leftHeaderArr.indexOf(rightTitle) - 2] + (3 * middle + 1)
    ).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "ffff00" }
    };
     worksheet.getCell(
      this.chArr[leftHeaderArr.indexOf(rightTitle) - 2] + (3 * middle + 1)
    ).value = 'DEL';
    worksheet.getCell(
      this.chArr[leftHeaderArr.indexOf(rightTitle) - 2] + (3 * middle + 1)
    ).alignment = { vertical: "middle", horizontal: "center" };

    worksheet.getCell(this.chArr[leftHeaderArr.indexOf(leftTitle)] + '1').alignment = { vertical: "middle", horizontal: "center" };
    worksheet.getCell(
      this.chArr[leftHeaderArr.indexOf(leftTitle)] + "1"
    ).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "f4b084" } };
    worksheet.getCell(this.chArr[leftHeaderArr.indexOf(leftTitle)] + '1').font = { bold: true };
    worksheet.getCell(this.chArr[leftHeaderArr.indexOf(rightTitle)] + '1').alignment = { vertical: "middle", horizontal: "center" };
    worksheet.getCell(this.chArr[leftHeaderArr.indexOf(rightTitle)] + '1').font = { bold: true };
    worksheet.getCell(this.chArr[leftHeaderArr.indexOf(rightTitle)] + '1').fill = { type: "pattern", pattern: "solid", fgColor: { argb: "ffc000" } };
    worksheet.getColumn(leftHeaderArr.indexOf(rightTitle) - 1).values=[1,2,4];
     workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      fs.saveAs(blob, "CarData.xlsx");
    });
    this.getLengthForSheet(data);
  }

  getLengthForSheet(data) {
    let allData = [];
    let leftData = [];
    let returnData = [];
    data.forEach( data => {
      let ele = Number(data[1]) + Number(data[2]);
      leftData.push(Number(data[1]));
      allData.push(ele);
    })
    let maxLength = Math.max(...allData);
    let maxLeft = Math.max(...leftData);
    returnData.push(maxLength/5, maxLeft/5, data.length);
    console.log(returnData);
    return returnData;
  }
}
