import { FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export const PageBlockFormValidator: ValidatorFn = (
    control: FormGroup
): ValidationErrors | null => {
    const text = control.get("text");
    const title = control.get("title");
    const hasButton = control.get("hasButton");
    const buttonUrl = control.get("buttonUrl");
    const buttonTitle = control.get("buttonTitle");

    const result = {
        pageBlockFormInValid: false,
        hasButtonInvalid: false,
    };

    if (hasButton && hasButton.value) {
        result.pageBlockFormInValid =
            text &&
            title &&
            buttonUrl &&
            buttonTitle &&
            text.value == "" &&
            title.value == "" &&
            buttonUrl.value == null &&
            buttonTitle.value == null
                ? true
                : null;
        result.hasButtonInvalid =
            buttonUrl.value == null || buttonTitle.value == null ? true : null;
    } else {
        result.pageBlockFormInValid =
            text && title && text.value == "" && title.value == ""
                ? true
                : null;
    }
    return result.pageBlockFormInValid || result.hasButtonInvalid
        ? result
        : null;
};
