import { Button, message, Modal } from "antd"
import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import MarkdownEditor from "@uiw/react-markdown-editor"
import { getActivity } from "../../../../Utils/requests"

const LongDescriptionModal = ({ learningStandard, selectActivity }) => {
  const [visible, setVisible] = useState(false);
  const [longDescription, setLongDescription] = useState("");

  useEffect(() => {
    const showLongDescriptionModal = async () => {
      const response = await getActivity(selectActivity.id)
      if (response.err) {
        message.error(response.err)
        return
      }
      setLongDescription(response.data.long_description)
    }
    showLongDescriptionModal()
  }, [selectActivity])

  document.documentElement.setAttribute("data-color-mode", "light")

  return (
    <div>
      <Button
        id="view-activity-button"
        onClick={() => setVisible(true)}
        style={{width: "40px", marginRight: "auto"}}
      >
        <svg height="1em" viewBox="0 0 576 512">
	  <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM432 256c0 79.5-64.5 144-144 144s-144-64.5-144-144s64.5-144 144-144s144 64.5 144 144zM288 192c0 35.3-28.7 64-64 64c-11.5 0-22.3-3-31.6-8.4c-.2 2.8-.4 5.5-.4 8.4c0 53 43 96 96 96s96-43 96-96s-43-96-96-96c-2.8 0-5.6 .1-8.4 .4c5.3 9.3 8.4 20.1 8.4 31.6z"/>
        </svg>
      </Button>
      <Modal
        title={`${learningStandard.name} - Activity ${selectActivity.number} - ID ${selectActivity.id}`}
        visible={visible}
	onCancel={() => setVisible(false)}
        footer={null}
        width="45vw"
	bodyStyle={{ overflow: "auto", maxHeight: "calc(100vh - 250px)" }}
      >
	<MarkdownEditor.Markdown source={longDescription} />
      </Modal>
    </div>
  )
}

LongDescriptionModal.propTypes = {
  learningStandard: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
  selectActivity: PropTypes.shape({
    id: PropTypes.number.isRequired,
    number: PropTypes.number.isRequired
  }).isRequired,
}

export default LongDescriptionModal
