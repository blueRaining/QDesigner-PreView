declare const JSZip: any

export interface LoadResult {
    modelUrl: string
    envUrl?: string
}

/**
 * 从 ZIP URL 加载：fetch ZIP → JSZip 解压 → 解析 config.json → 返回 blob URL
 */
export async function loadFromZipUrl(url: string): Promise<LoadResult> {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Failed to fetch ZIP: ${response.status} ${response.statusText}`)
    }
    const arrayBuffer = await response.arrayBuffer()
    const zip = await JSZip.loadAsync(arrayBuffer)

    // 读取 config.json
    const configFile = zip.file('config.json')
    if (!configFile) {
        throw new Error('config.json not found in ZIP')
    }
    const configText = await configFile.async('text')
    const config = JSON.parse(configText) as { model: string; environment?: string }

    // 提取模型文件
    const modelFile = zip.file(config.model)
    if (!modelFile) {
        throw new Error(`Model file "${config.model}" not found in ZIP`)
    }
    const modelBlob = await modelFile.async('blob')
    const modelUrl = URL.createObjectURL(modelBlob) + '#model.rain'

    // 提取环境球文件（可选）
    let envUrl: string | undefined
    if (config.environment) {
        const envFile = zip.file(config.environment)
        if (envFile) {
            const envBlob = await envFile.async('blob')
            envUrl = URL.createObjectURL(envBlob) + '#environment.env'
        }
    }

    return { modelUrl, envUrl }
}

/**
 * 从 config URL 加载：fetch config.json → 按相对路径 fetch model 和 environment
 */
export async function loadFromConfigUrl(url: string): Promise<LoadResult> {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Failed to fetch config: ${response.status} ${response.statusText}`)
    }
    const config = (await response.json()) as { model: string; environment?: string }

    // 计算基础路径
    const baseUrl = url.substring(0, url.lastIndexOf('/') + 1)

    // 加载模型
    const modelResponse = await fetch(baseUrl + config.model)
    if (!modelResponse.ok) {
        throw new Error(`Failed to fetch model: ${modelResponse.status}`)
    }
    const modelBlob = await modelResponse.blob()
    const modelUrl = URL.createObjectURL(modelBlob) + '#model.rain'

    // 加载环境球（可选）
    let envUrl: string | undefined
    if (config.environment) {
        const envResponse = await fetch(baseUrl + config.environment)
        if (envResponse.ok) {
            const envBlob = await envResponse.blob()
            envUrl = URL.createObjectURL(envBlob) + '#environment.env'
        }
    }

    return { modelUrl, envUrl }
}
