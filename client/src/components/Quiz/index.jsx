import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ReactPlayer from 'react-player'
import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import styles from './Post.module.scss';
import { PostSkeleton } from './Skeleton';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import ReactAudioPlayer from 'react-audio-player';
import { useTranslation } from 'react-i18next';



export const Quiz = ({
  id,
  title,
  video,
  audio,
  file,
  status,
  lock,
  unlock,
  deleteHandler,
  children,
  isFullPost,
  isLoading,
  isEditable,
}) => {
  const {t} = useTranslation();
  if (isLoading) {
    return <PostSkeleton />;
  }

  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  
  
  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
      {isEditable && (
        <div className={styles.editButtons}>
          <Link to={`/results/${id}`}>
            <IconButton color="primary">
              <FormatListBulletedIcon />
            </IconButton>
          </Link>
          <Link to={`/quizes/${id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          {status ? 
            <IconButton color="secondary" onClick={() => lock(id)}>
              <LockIcon />
            </IconButton>
            
           : 
            <IconButton color="primary" onClick={() => unlock(id)}>
              <LockOpenIcon />
            </IconButton>
           }
          <IconButton onClick={() => deleteHandler(id)} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      <div className={styles.wrapper}>
        <div className={styles.indention}>
          <h2 className={clsx(styles.title, { [styles.titleFull]: isFullPost })}>
            {isFullPost ? title : <Link to={`/quizes/${id}`}>{title}</Link>}
          </h2>
          {video ? 
            <div style={{margin: "20px auto", height: "500px"}}>
              <h2>{t('video')}</h2>
              <ReactPlayer url={video} controls={true} style={{margin: "0 auto"}} width="100%" height="100%"/> 
            </div>
            : ''}
          {audio ? 
          (<>
          <h2>{t('audio')}</h2>
            {audio.map((track, i) =>(
            <div style={{marginTop: "60px"}} key={i}>
            <ReactAudioPlayer src={`http://localhost:8000${track}`} controls style={{width: "100%"}}/> 
          </div>
          ))}
          </>)
            
            : ''}
          {file ? <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.1.81/build/pdf.worker.min.js">
            <h2>{t('materials')}</h2>
            <div style={{ height: "820px" }}>
              <Viewer fileUrl={`http://localhost:8000${file}`}  plugins={[defaultLayoutPluginInstance]}/>
            </div>
          </Worker> : ""}
          {children && <div className={styles.content}>{children}</div>}
        </div>
      </div>
    </div>
  );
};
