import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { HiPlus } from 'react-icons/hi'
import * as Yup from 'yup'
import Button from 'ui/button'
import Field from 'ui/field'
import Input from 'ui/input'
import Modal from 'ui/modal'

const validationSchema = Yup.object().shape({
  url: Yup.string().url('Invalid URL').required('URL is required'),
})

type CreateBookmarkButtonProps = {
  className?: string
  style?: React.CSSProperties
}

export default function CreateBookmarkButton({ className, style }: CreateBookmarkButtonProps) {
  const [modalVisible, setModalVisible] = useState(false)

  const formik = useFormik({
    validationSchema,
    initialValues: { url: '' },
    onSubmit: ({ url }) => {
      console.log({ url })
    },
  })

  useEffect(function getCopiedTextFromClipboard() {
    navigator.clipboard.readText().then((text) => {
      Yup.string()
        .url()
        .validate(text)
        .then(() => {
          formik.setValues({ url: text })
        })
        .catch(() => {})
    })
  })

  return (
    <>
      <Button
        icon={<HiPlus />}
        className={className}
        style={style}
        onClick={() => {
          setModalVisible(true)
        }}
      >
        Bookmark
      </Button>
      <Modal
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false)
        }}
        title="Add Bookmark"
        onOk={formik.handleSubmit}
        okButtonProps={{
          type: 'submit',
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Field label="Site URL" name="url" errorMessage={formik.errors.url}>
            <Input className="w-full" onChange={formik.handleChange('url')} value={formik.values.url} />
          </Field>
        </form>
      </Modal>
    </>
  )
}
