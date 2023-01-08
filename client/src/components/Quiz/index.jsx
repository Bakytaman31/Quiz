import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ReactPlayer from 'react-player'
import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import styles from './Post.module.scss';
import { UserInfo } from '../UserInfo';
import { PostSkeleton } from './Skeleton';
import { fetchQuizes, fetchRemoveQuiz } from '../../redux/slices/quizes';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import ReactAudioPlayer from 'react-audio-player';

export const Quiz = ({
  id,
  title,
  createdAt,
  user,
  video,
  audio,
  file,
  date,
  deleteHandler,
  children,
  isFullPost,
  isLoading,
  isEditable,
}) => {
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
          <IconButton onClick={() => deleteHandler(id)} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      <div className={styles.wrapper}>
        <UserInfo {...user} additionalText={createdAt.substring(0, 10)} />
        <div className={styles.indention}>
          <h2 className={clsx(styles.title, { [styles.titleFull]: isFullPost })}>
            {isFullPost ? title : <Link to={`/quizes/${id}`}>{title}</Link>}
          </h2>
          {date ? `Сдать до ${date.format("DD/MM/YYYY")}` : ''}
          {video ? 
            <div style={{margin: "20px auto", height: "500px"}}>
              <h2>Видео</h2>
              <ReactPlayer url={video} controls={true} style={{margin: "0 auto"}} width="100%" height="100%"/> 
            </div>
            : ''}
          {audio ? 
            <div style={{marginTop: "60px"}}>
              <h2>Аудио</h2>
              <ReactAudioPlayer src={`http://localhost:8000${audio}`} controls style={{width: "100%"}}/> 
            </div>
            : ''}
          {file ? <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.1.81/build/pdf.worker.min.js">
            <h2>Материалы</h2>
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
