import styles from './Loading.module.less'

const Loading = () => {
    return (
        <div className={styles.loadingWrapper}>
            {/* 背景浮动粒子 */}
            <div className={styles.particles}>
                {Array.from({ length: 8 }, (_, i) => (
                    <div key={i} className={styles.particle} />
                ))}
            </div>

            {/* 立方体 + 底部光晕 */}
            <div className={styles.cubeWrap}>
                <div className={styles.glow} />
                <div className={styles.cubeScene}>
                    <div className={styles.cube}>
                        <div className={styles.front} />
                        <div className={styles.back} />
                        <div className={styles.right} />
                        <div className={styles.left} />
                        <div className={styles.top} />
                        <div className={styles.bottom} />
                    </div>
                </div>
            </div>

            <div className={styles.text}>初始化中...</div>

            {/* 底部扫光条 */}
            <div className={styles.progressBar}>
                <div className={styles.progressLight} />
            </div>
        </div>
    )
}

export default Loading
