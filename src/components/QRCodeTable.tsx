'use client'
import { GetTableLink } from '@/helper/GetUrlQrOrder'
import QRCode from 'qrcode'
import { useEffect, useRef } from 'react'

export const QRCodeTable = ({
  token,
  tableNumber,
  width = 250,
  tableId
}: {
  token: string
  tableNumber: number
  width?: number
  tableId:string
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const qrCanvas = document.createElement('canvas')
    // const canvas = canvasRef.current!
    const canvas = canvasRef.current!
    canvas.height = width + 70
    canvas.width = width
    // const qrContext = qrCanvas.getContext('2d')!
    const canvasContext = canvas.getContext('2d')!
    canvasContext.fillStyle = '#fff'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)

    canvasContext.font = '20px Arial'
    canvasContext.textAlign = 'center'
    canvasContext.fillStyle = '#000'
    canvasContext.fillText(`Table number ${tableNumber}`, width / 2, width + 20)
    canvasContext.fillText('Scan to order', width / 2, width + 50)
    QRCode.toCanvas(
      qrCanvas,
      GetTableLink({
        token,
        tableNumber,
        tableId
      }),
      {
        width,
        margin: 4
      },
      function (error) {
        if (error) console.error(error)
        canvasContext.drawImage(qrCanvas, 0, 0, width, width)
      }
    )
  }, [token, tableNumber, width,tableId])
  return <canvas ref={canvasRef} />
}
