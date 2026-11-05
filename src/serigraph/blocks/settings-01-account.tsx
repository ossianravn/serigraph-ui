"use client"

import {
  SettingsRow,
  SettingsSection,
} from "@/serigraph/blocks/settings-01-rows"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/serigraph/ui/alert-dialog"
import { Button } from "@/serigraph/ui/button"

// Closing the account: a rose button on the controls' edge, one line on what it does, and an alert dialog that says
// what is lost before anything happens. Keeping the account is the dialog's first choice.
export function CloseAccountSection({
  hint,
  note,
  onClose,
}: {
  /** One line under the button. */
  hint: string
  /** What closing removes, in the dialog. */
  note: string
  onClose?: () => void
}) {
  return (
    <SettingsSection title="Close your account">
      <SettingsRow hint={hint}>
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="destructive" />}>
            Close account
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Close your account?</AlertDialogTitle>
              <AlertDialogDescription>{note}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep my account</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={() => onClose?.()}
              >
                Close account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SettingsRow>
    </SettingsSection>
  )
}
