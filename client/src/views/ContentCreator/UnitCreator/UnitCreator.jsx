import { Button, Form, Input, message, Modal } from "antd"
import React, { useState } from "react"
import PropTypes from "prop-types"
import { createUnit, getAllUnits } from "../../../Utils/requests"
import "./UnitCreator.less"

function UnitCreator({ gradeList, setUnitList }) {
  const [visible, setVisible] = useState(false)
  const [grade, setGrade] = useState("")
  const [name, setName] = useState("")
  const [number, setNumber] = useState("")
  const [description, setDescription] = useState("")
  const [standard, setStandard] = useState("")

  const showModal = () => {
    setNumber("")
    setName("")
    setDescription("")
    setStandard("")
    setVisible(true)
  }

  const handleCancel = () => {
    setVisible(false)
  }

  const handleSubmit = async e => {
    const res = await createUnit(number, name, standard, description, grade)
    if (res.err) {
      message.error("Fail to create a new unit")
    } else {
      message.success("Successfully created unit")
      const unitRes = await getAllUnits()
      setUnitList(unitRes.data)
      setVisible(false)
    }
  }

  return (
    <div>
      <button onClick={showModal} id="add-unit-btn">
        + Add Unit
      </button>
      <Modal
        title="Create Unit"
        open={visible}
        width="35vw"
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          id="add-units"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 14,
          }}
          onFinish={handleSubmit}
          layout="horizontal"
          size="default"
        >
          <Form.Item id="form-label" label="Grade">
            <select
              id="grade-dropdown"
              name="grade"
              defaultValue={grade}
              required
              onChange={e => setGrade(e.target.value)}
            >
              <option key={0} value={grade} disabled id="disabled-option">
                Grade
              </option>
              {gradeList.map(grade_ => (
                <option key={grade_.id} value={grade_.id}>
                  {grade_.name}
                </option>
              ))}
            </select>
          </Form.Item>
          <Form.Item id="form-label" label="Unit Name">
            <Input
              onChange={e => setName(e.target.value)}
              value={name}
              placeholder="Enter unit name"
              required
            />
          </Form.Item>
          <Form.Item id="form-label" label="Unit Number">
            <Input
              onChange={e => setNumber(e.target.value)}
              type="number"
              value={number}
              placeholder="Enter unit number"
              min={1}
              max={15}
              required
            />
          </Form.Item>
          <Form.Item id="form-label" label="Description">
            <Input.TextArea
              rows={3}
              onChange={e => setDescription(e.target.value)}
              value={description}
              placeholder="Enter unit description"
              required
            />
          </Form.Item>
          <Form.Item id="form-label" label="Standards">
            <Input
              onChange={e => setStandard(e.target.value)}
              value={standard}
              placeholder="Enter unit Standards"
              required
            />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
            style={{ marginBottom: "0px" }}
          >
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="content-creator-button"
            >
              Submit
            </Button>
            <Button
              onClick={handleCancel}
              size="large"
              className="content-creator-button"
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

UnitCreator.propTypes = {
  gradeList: PropTypes.arrayOf(PropTypes.object).isRequired,
  setUnitList: PropTypes.func.isRequired
}

export default UnitCreator;
