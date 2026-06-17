export const Capitalize = ({ children }: { children?: React.ReactNode }) => {
  return (
    <span style={{ textTransform: 'capitalize' }}>
      {children}
    </span>
  )
}