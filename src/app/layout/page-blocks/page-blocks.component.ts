import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { ApiService } from "../../api.service";
import { ToastrService } from "ngx-toastr";
import {
    CountObject,
    PageBlock,
    RESTFilter,
} from "../../Interfaces/interfaces";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { error } from "util";
import swal from "sweetalert2";
declare const $: any;

@Component({
    selector: "app-page-blocks",
    templateUrl: "./page-blocks.component.html",
    styleUrls: ["./page-blocks.component.scss"],
})
export class PageBlocksComponent implements OnInit {
    token: string;
    data: any = {};
    totalBlocks: number;
    itemCount: number;
    limits = [1, 10, 20, 40, 80];
    pageBlocks: Array<PageBlock> = [];
    serverPageBlocksResponse: Array<PageBlock> = [];
    currentPage: number = 1;
    pageSize: number;
    filter: RESTFilter = {};
    delayTimer: any;
    pageBlockDetails: PageBlock;
    noDataMessage: string = "No data available";
    conformationMessage: string;
    place: "new" | "modal";

    constructor(
        public spinner: NgxSpinnerService,
        private service: ApiService,
        private toastr: ToastrService,
        private modalService: NgbModal
    ) {}

    ngOnInit() {
        this.getPageBlocksCount();
    }
    ngOnDestroy() {}

    getPageBlocksCount() {
        this.spinner.show();
        this.filter.where = {
            or: [
                { title: this.filter.search },
                { text: this.filter.search },
                { url: this.filter.search },
            ],
        };
        this.service
            .getPageBlocksCount(this.filter)
            .then((response: CountObject) => {
                this.spinner.hide();
                this.totalBlocks = response.count;
                this.itemCount = response.count;
            })
            .catch((error) => {
                this.spinner.hide();
                this.toastr.error(error.error.message);
            });
    }

    getPageBlocks() {
        this.spinner.show();
        this.service
            .getPageBlockList({ filter: this.filter })
            .then((response: Array<PageBlock>) => {
                this.spinner.hide();
                this.pageBlocks = response;
                this.serverPageBlocksResponse = response;
                this.pageSize = response.length;
                // this.currentPage =
            })
            .catch((error) => {
                this.spinner.hide();
                this.toastr.error(error.error.message);
            });
    }

    searchContent() {}
    reloadItems(state) {
        this.filter.limit = state.limit;
        this.filter.skip = state.offset * state.limit;
        this.getPageBlocks();
    }
    open(content, item, isNew = false) {
        // return false;
        if (!isNew) {
            this.pageBlockDetails = item;
            this.place = "modal";
        } else {
            this.place = "new";
            this.pageBlockDetails = {
                title: null,
                text: null,
                url: null,
                hasButton: false,
                buttonUrl: null,
                buttonTitle: null,
                position: this.totalBlocks ? this.totalBlocks + 1 : 1,
            };
        }

        this.modalService
            .open(content, { size: "lg", backdrop: false })
            .result.then(
                (result) => {},
                (reason) => {}
            );
    }
    openNewModal(content) {
        this.open(content, {}, true);
    }
    closeCurrentModal() {
        $(".close").trigger("click");
    }
    onSubmit(item: PageBlock) {
        this.spinner.show();
        this.service
            .putPageBlock(item)
            .then((response) => {
                this.spinner.hide();
                this.closeCurrentModal();
                this.getPageBlocksCount();
                this.getPageBlocks();
                this.toastr.success("Page block has been saved successfully");
            })
            .catch((error) => {
                this.spinner.hide();
                this.toastr.error(error.error.message);
            });
    }
    deletePageBlock(item) {
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this page block",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {
                this.spinner.show();
                this.service
                    .deletePageBlock(item)
                    .then((response) => {
                        this.spinner.hide();
                        this.getPageBlocksCount();
                        this.toastr.success(
                            "Page block has been removed successfully"
                        );
                    })
                    .catch((error) => {
                        this.spinner.hide();
                        this.toastr.error(error.error.message);
                    });
            }
        });
    }
}
