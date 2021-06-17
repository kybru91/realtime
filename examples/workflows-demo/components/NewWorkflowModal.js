/**
 * Index is the "Workflows page"
 */

import { Menu, Button, Input, Modal, Typography } from '@supabase/ui'
import { useState, useEffect } from 'react'


export default function NewWorkflowModal({ visible, onCancel, onConfirm }) {
  const [name, setName] = useState('')
  const [trigger, setDefaultTrigger] = useState('public:users')
  const [default_execution_type, setDefaultExecutionType] = useState('transient')
  const [definition, setDefinition] = useState({})

  useEffect(() => {
    setDefinition({
      "StartAt": trigger,
      "States": {
        [trigger]: {
          "Type": "Pass",
          "Next": "TriggerWebhook"
        },
        "TriggerWebhook": {
          "Type": "Task",
          "Resource": "http",
          "Parameters": {
              "url": "https://webhook.site/421b6551-c0df-4302-9967-24150fb224a1",
              "method": "POST",
              "payload": {
                "changes.$": "$.changes"
              }
          },
          "Next": "Complete"
        },
        "Complete": {
          "Type": "Succeed"
        }
      }
    })
  }, [trigger])

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      onConfirm={() => {
        const payload = { name, default_execution_type, trigger, definition }
        setName('')
        return onConfirm(payload)
      }}
    >
      <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input label="Name" value={trigger} onChange={(e) => setDefaultTrigger(e.target.value)} />
    </Modal>
  )
}
