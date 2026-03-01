import { useState, useEffect, useRef, useCallback } from 'react'
import { Viewer3D } from '../3D/Preview'
import { loadFromZipUrl, loadFromConfigUrl } from '../utils/loader'
import type { LoadResult } from '../utils/loader'
import Loading from './Loading'
import style from './Viewer.module.less'

const isMobile = () => {
    const ua = navigator.userAgent
    const mobileRegex = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i
    const isMobileDevice = mobileRegex.test(ua)
    const isSmallScreen = window.innerWidth <= 768
    return isMobileDevice || isSmallScreen
}

const Viewer = () => {
    const [showLoading, setShowLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const resolveParams = useCallback(async (): Promise<LoadResult | null> => {
        const params = new URLSearchParams(window.location.search)
        const zipUrl = params.get('zipUrl')
        const configUrl = params.get('configUrl')
        const modelUrl = params.get('modelUrl')
        const envUrl = params.get('envUrl')

        if (zipUrl) {
            return loadFromZipUrl(zipUrl)
        }
        if (configUrl) {
            return loadFromConfigUrl(configUrl)
        }
        if (modelUrl) {
            return { modelUrl, envUrl: envUrl || undefined }
        }
        // 无参数时默认加载内置模型
        return loadFromConfigUrl('/models/Packaging_box2/config.json')
    }, [])

    useEffect(() => {
        let viewer: Viewer3D | null = null

        const init = async () => {
            if (!canvasRef.current) return

            try {
                const result = await resolveParams()
                if (!result) {
                    setError('请提供 zipUrl、configUrl 或 modelUrl 参数')
                    setShowLoading(false)
                    return
                }

                viewer = new Viewer3D(canvasRef.current, {
                    modelUrl: result.modelUrl,
                    environmentUrl: result.envUrl,
                    optimization: isMobile(),
                })
                await viewer.init()
                setShowLoading(false)
            } catch (e) {
                console.error('Failed to load:', e)
                setError(`加载失败: ${e instanceof Error ? e.message : String(e)}`)
                setShowLoading(false)
            }
        }

        init()

        return () => {
            if (viewer) {
                viewer.dispose()
            }
        }
    }, [])

    return (
        <div className={style.wrapper}>
            <div className={style.renderCanvasContainer}>
                <canvas
                    className={style.renderCanvas}
                    id="renderCanvas"
                    ref={canvasRef}
                ></canvas>
            </div>
            {showLoading && !error && <Loading />}
            {error && <div className={style.error}>{error}</div>}
        </div>
    )
}

export default Viewer
