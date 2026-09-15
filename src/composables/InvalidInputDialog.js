import { computed, ref, watch } from "vue"
import { useCalculator } from "./Calculator";

export function useInvalidInputDialog(isInvalidComp, label){

    const dialogRef = ref(null);
    const isInvalid = computed(() => isInvalidComp.value);
    const dialogLabel = computed(() => `Please enter ${getDialogLabel(label)}.`)

    const calculator = useCalculator();

    function init(){        
        watch(calculator.calculatorCalculating, (calcing) => {
            if(calcing && isInvalid.value){
                dialogRef.value?.openDialog();
                calculator.calculatorCalculating.value = false;
            }
        });
    }

    function getDialogLabel(label){
        return label?.trim()?.replaceAll(':', '');
    }

    return {
        dialogRef, init, getDialogLabel, dialogLabel
    }

}