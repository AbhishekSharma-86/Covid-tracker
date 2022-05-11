import * as React from "react";

import { IgrLiveGridModule } from 'igniteui-react-grids';
import { IgrLiveGrid } from 'igniteui-react-grids';
import { IgrTextColumn } from 'igniteui-react-grids';
import { IgrNumericColumn } from 'igniteui-react-grids';
import { IgrPrimaryKeyValue } from 'igniteui-react-grids';
import { IgrGridSelectedKeysChangedEventArgs } from 'igniteui-react-grids';

import { IgrTemplateColumn, IIgrCellTemplateProps } from 'igniteui-react-grids';
import { IgrTemplateCellUpdatingEventArgs } from 'igniteui-react-grids';
import { IgrTemplateCellInfo } from 'igniteui-react-grids';

import { DataService, OutbreakLocation } from "../data/DataService";

IgrLiveGridModule.register();

export class ListView extends React.Component<any, any> {

    public grid: IgrLiveGrid ;
    public header: HTMLDivElement;
    public dataLocations: OutbreakLocation[] = [];

    public gridSelecting = false;
    public onSelected?: (s: ListView, items: string[]) => void;

    constructor(props: any) {
      super(props);

        this.onHeaderRef = this.onHeaderRef.bind(this);
        this.onGridRef = this.onGridRef.bind(this);
        this.onGridRowSelected = this.onGridRowSelected.bind(this);
        this.onFlagCellUpdating = this.onFlagCellUpdating.bind(this);

        const valuePropertyPath = this.props.valuePropertyPath || "totalInfections";
        const indexPropertyPath = this.props.indexPropertyPath || "indexInfections";
        const namePropertyPath = this.props.namePropertyPath || "country";
        const imagePropertyPath = this.props.imagePropertyPath || "flag";
        const selectedItemKeys = this.props.selectedItemKeys || [];

        this.state = {
            valuePropertyPath: valuePropertyPath,
            indexPropertyPath: indexPropertyPath,
            namePropertyPath: namePropertyPath,
            imagePropertyPath: imagePropertyPath,
            selectedItemKeys: selectedItemKeys,
        };
    }

    public onGridRef(grid: IgrLiveGrid) {
        this.grid = grid;
    }

    public onHeaderRef(header: HTMLDivElement) {
        this.header = header;
    }

    public render() {

        let valuePropertyPath = this.state.valuePropertyPath;
        let namesPropertyPath = this.props.showCodes ? this.props.codePropertyPath : this.props.namePropertyPath;
        let namesColumnWidth = this.props.showCodes ? "*>40" : "*>80";

        let theme = this.props.theme || {};
        let listClass = "app-list-" + theme.name;
        let listStyle: any = {};
        listStyle.maxWidth = "20rem";
        if (this.props.showCodes) {
            listStyle.maxWidth = "12rem";
        } else if (!this.props.showCodes && !this.props.showIndex) {
            listStyle.maxWidth = "16rem";
        } else {
            listStyle.maxWidth = "20rem";
        }

        // listStyle.maxWidth = this.props.showCodes ? "20rem" : "12rem";

        let dataStyle: any;
        if (valuePropertyPath === "totalInfections" || valuePropertyPath === "weeklyInfections" || valuePropertyPath === "dailyInfections") {
            dataStyle = theme.infections;
        }
        else if (valuePropertyPath === "totalDeaths" || valuePropertyPath === "weeklyDeaths" || valuePropertyPath === "dailyDeaths") {
            dataStyle = theme.deaths;
        }
        else if (valuePropertyPath === "totalRecoveries") {
            dataStyle = theme.recoveries;
        }

        let headerClass = "app-list-header-" + theme.name;
        let headerText = DataService.GetDisplayName(valuePropertyPath, this.props.usePropStats);
        if (this.props.usePropStats) {
            headerText = headerText.replace("Total", "");
        }

        return (
        <div className={listClass} style={listStyle}>

            <div className={headerClass}>
                <div className="app-list-header-name"  style={dataStyle}>{headerText}</div>
                <div className="app-list-header-value" style={theme.listValue} ref={this.onHeaderRef}>0</div>
            </div>

            <IgrLiveGrid  ref={this.onGridRef}
                height="calc(100% - 5.5rem)"
                width="100%"
                rowHeight="45"
                selectionMode="MultipleRow"
                selectionBehavior="Toggle"
                cellSelectedBackground={theme.listSelected.color}
                cellTextColor={theme.listItem.color}
                rowSelectionAnimationMode="None"
                rowSeparatorHeight="0"
                cellBackground="transparent"
                autoGenerateColumns="false" headerHeight={0}
                selectedKeysChanged={this.onGridRowSelected}>

                <IgrTemplateColumn paddingTop="0" paddingBottom="0" paddingLeft="10" paddingRight="0"
                propertyPath={this.state.imagePropertyPath}
                cellUpdating={this.onFlagCellUpdating}
                isHidden={!this.props.showFlags}
                width="45"/>

                <IgrNumericColumn paddingTop="0" paddingBottom="0" paddingLeft="0" paddingRight="0"
                propertyPath={this.state.indexPropertyPath}
                width="40"
                isHidden={!this.props.showIndex}
                positivePrefix=""
                showGroupingSeparator="true"
                textStyle="1rem 'Titillium Web'"
                horizontalAlignment="center"/>

                <IgrTextColumn  paddingTop="0" paddingBottom="0" paddingLeft="10" paddingRight="0"
                propertyPath={namesPropertyPath}
                horizontalAlignment="left"
                textStyle="1rem 'Titillium Web'"
                width={namesColumnWidth}/>

                <IgrNumericColumn  paddingTop="0" paddingBottom="0" paddingLeft="0" paddingRight="15"
                propertyPath={valuePropertyPath}
                positivePrefix=""
                maxFractionDigits="0"
                showGroupingSeparator="true"
                textStyle="bold 1rem 'Titillium Web'"
                width="85"/>


            </IgrLiveGrid>
        </div>
        );
    }

    public onFlagCellUpdating(column: IgrTemplateColumn, args: IgrTemplateCellUpdatingEventArgs) {
        let content = args.content as HTMLDivElement;
        let icon: HTMLImageElement | null = null;

        if (content.childElementCount > 0) {
            icon = content.children[0] as HTMLImageElement;
        } else {
            icon = document.createElement("img");
            icon.style.border = "0.5px solid rgb(100, 100, 100)";
            icon.style.height = "1.2rem";
            icon.style.width = "2.0rem";
            icon.style.minWidth = "2.0rem";
            icon.style.objectFit = "cover";
            icon.style.verticalAlign = "middle";
            icon.style.background = "transparent";
            content.appendChild(icon);
        }

        let dataItem = args.cellInfo.rowItem as OutbreakLocation;
        icon.src = dataItem.flag;
    }

    public onGridRowSelected(s: IgrLiveGrid, e: IgrGridSelectedKeysChangedEventArgs) {
        if (this.gridSelecting) { return; }

        let selectedItemKeys = this.state.selectedItemKeys;
        let oldItemsCount = selectedItemKeys.length;

        if (e.addedKeys.count > 0) {
            let clickedRow = e.addedKeys.item(0) as IgrPrimaryKeyValue;
            let dataItem = clickedRow.value[0] as OutbreakLocation;
            if (!selectedItemKeys.contains(dataItem.iso)) {
                 selectedItemKeys.push(dataItem.iso);
            }
        }

        if (e.removedKeys.count > 0) {
            let clickedRow = e.removedKeys.item(0) as IgrPrimaryKeyValue;
            let dataItem = clickedRow.value[0] as OutbreakLocation;
            selectedItemKeys.remove(dataItem.iso);
        }

        let newItemsCount = selectedItemKeys.length;
        let didItemsChanged = newItemsCount !== oldItemsCount;
        if (didItemsChanged) {
            this.setState( { selectedItemKeys: selectedItemKeys } );

            if (this.props.onSelected !== undefined) {
                this.props.onSelected(this, selectedItemKeys);
            }
        }
    }

    public selectData(selectedItemKeys: string[]) {

        this.gridSelecting = true;

        let valuePropertyPath = this.props.valuePropertyPath || "totalInfections";
        // console.log("selectLists  " + selectedItemKeys.join(" ") + " " + valuePropertyPath);

        this.grid.selectedKeys.clear();

        for (let i = 0; i < this.dataLocations.length; i++) {
                let dataKey = this.dataLocations[i].iso;
                let dataSelected = selectedItemKeys.contains(dataKey);
                // let dataRow = new IgrPrimaryKeyValue([dataKey], [this.dataLocations[i]]);
                let dataRow = new IgrPrimaryKeyValue(null, [this.dataLocations[i]]);
                if (dataSelected) {
                    this.grid.selectedKeys.add(dataRow);
                }
        }

        this.gridSelecting = false;

        this.setState( { selectedItemKeys: selectedItemKeys } );
    }

    public updateFlags(showFlags: boolean) {
        this.setState( { showFlags: showFlags } );
    }

    public updateData(outbreaks: OutbreakLocation[], selectedItemKeys: string[], showFlags: boolean) {

        let dataTotal = 0;
        let valuePropertyPath = this.props.valuePropertyPath || "totalInfections";
        let indexColumn = this.props.indexPropertyPath || "indexInfections";
        let dataItemsCount = this.dataLocations.length;

        this.dataLocations = outbreaks.filter(item => item[valuePropertyPath] >= 0)

        this.dataLocations = this.dataLocations.sort((a, b) => {
            let delta = b[valuePropertyPath] - a[valuePropertyPath];
            if (delta === 0) { return b.country > a.country ? -1 : 1; }
            else { return delta; }
        });

        for (let i = 0; i < this.dataLocations.length; i++) {
            this.dataLocations[i][indexColumn] = i + 1;
            dataTotal += this.dataLocations[i][valuePropertyPath];
        }

        this.grid.dataSource = this.dataLocations;
        this.grid.notifyClearItems();
        this.grid.flush();
        this.header.textContent = DataService.format(dataTotal);

        if (dataItemsCount === 0) { // first update
            this.selectData(selectedItemKeys);
        }

        this.setState( { showFlags: showFlags } );
    }

    public updateTheme(themeName: string) {

        this.grid.notifyClearItems();
    }
}