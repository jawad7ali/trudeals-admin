import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { PageBlock } from "../../../Interfaces/interfaces";
import { ckEditorConfig } from "../../../constant";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { PageBlockFormValidator } from "../../../shared/validators/page-block-form.directive";

@Component({
    selector: "app-add-page-blocks",
    templateUrl: "./add-page-blocks.component.html",
    styleUrls: ["./add-page-blocks.component.scss"],
})
export class AddPageBlocksComponent implements OnInit {
    @Input() pageBlock: PageBlock;
    @Input() place: "modal" | "new";
    @Input() totalPageBlocks: number;
    @Output() onSubmit = new EventEmitter<PageBlock>();
    ckEditorConfig: any;
    pageBlockForm: FormGroup;
    constructor() {
        this.ckEditorConfig = ckEditorConfig;
    }

    ngOnInit() {
        this.pageBlockForm = new FormGroup(
            {
                url: new FormControl(this.pageBlock.url, [
                    Validators.required,
                    Validators.minLength(2),
                ]),
                position: new FormControl(this.pageBlock.position, [
                    Validators.min(1),
                ]),
                title: new FormControl(this.pageBlock.title),
                text: new FormControl(this.pageBlock.text),
                hasButton: new FormControl(this.pageBlock.hasButton),
                buttonUrl: new FormControl(this.pageBlock.buttonUrl),
                buttonTitle: new FormControl(this.pageBlock.buttonTitle),
            },
            { validators: PageBlockFormValidator }
        );
    }

    onReady(editor) {
        editor.ui
            .getEditableElement()
            .parentElement.insertBefore(
                editor.ui.view.toolbar.element,
                editor.ui.getEditableElement()
            );
    }

    onHasButtonClick() {
        this.pageBlockForm.controls["hasButton"].setValue(
            !this.pageBlockForm.value.hasButton
        );
        if (!this.pageBlockForm.value.hasButton) {
            this.pageBlockForm.controls["buttonUrl"].setValue(null);
            this.pageBlockForm.controls["buttonTitle"].setValue(null);
        }
    }

    onSubmitClick() {
        this.pageBlock = { ...this.pageBlockForm.value, id: this.pageBlock.id };
        this.onSubmit.emit(this.pageBlock);
    }
}
