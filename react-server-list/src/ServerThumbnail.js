import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DescriptionIcon from '@mui/icons-material/Menu';
import MuiWarningIcon from '@mui/icons-material/Warning';
import ms from 'ms';
import DescriptionDialog from './DescriptionDialog';
import CurrentMedia from './CurrentMedia';
import './ServerThumbnail.css';

const {
  useCallback,
  useState,
} = React;

const downTimeout = ms('10 minutes');

/**
 * @param {import('@mui/material/SvgIcon').SvgIconProps} props
 */
function WarningIcon(props) {
  return (
    <MuiWarningIcon
      {...props} // eslint-disable-line react/jsx-props-no-spreading
      style={{
        height: 16,
        width: 16,
        verticalAlign: 'sub',
      }}
    />
  );
}

/**
 * @typedef {object} WarningTextProps
 * @prop {import('react').ReactNode} children
 *
 * @param {WarningTextProps} props
 */
function WarningText({ children }) {
  return (
    <Typography variant="body1" style={{ color: '#ed404f' }}>
      {children}
    </Typography>
  );
}

WarningText.propTypes = {
  children: PropTypes.node.isRequired,
};

/** @param {string} since */
function timedOutMessage(since) {
  return ` This server may be down. It has not responded for ${since}.`;
}

/**
 * @param {import('./hub').Server} server
 * @return {server is { description: string }}
 */
function hasDescription(server) {
  return typeof server.description === 'string';
}

/**
 * @typedef {object} ServerThumbnailProps
 * @prop {import('./hub').Server} server
 * @prop {import('./hub').Media} [media]
 *
 * @param {ServerThumbnailProps} props
 */
function ServerThumbnail({ server, media }) {
  const [isOpen, setDescriptionOpen] = useState(false);
  const onOpenDescription = useCallback(
    /** @param {React.MouseEvent<HTMLButtonElement>} event */
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      setDescriptionOpen(true);
    },
    [],
  );
  const onCloseDescription = useCallback(() => {
    setDescriptionOpen(false);
  }, []);

  return (
    <div className="usl-ServerThumbnail">
      <Card>
        <CardContent>
          <div className="usl-ServerThumbnail-header">
            <div>
              <Typography variant="h5">
                {server.name}
              </Typography>
              <Typography variant="body2">
                {server.subtitle}
              </Typography>
            </div>
            {server.description && (
              <IconButton
                aria-label={`View description for ${server.name}`}
                onClick={onOpenDescription}
              >
                <DescriptionIcon />
              </IconButton>
            )}
          </div>
        </CardContent>

        {media ? (
          <a href={server.url} className="usl-ServerThumbnail-link">
            <CurrentMedia media={media} />
          </a>
        ) : (
          <>
            <a href={server.url} className="usl-ServerThumbnail-link">
              <CardContent className="usl-ServerThumbnail-nobodyPlaying">
                <Typography>Nobody is playing!</Typography>
              </CardContent>
            </a>
            <CardActions className="usl-ServerThumbnail-actions">
              <Button
                variant="contained"
                color="primary"
                href={server.url}
              >
                Join
              </Button>
            </CardActions>
          </>
        )}

        {server.timeSincePing >= downTimeout ? (
          <CardContent>
            <WarningText>
              <WarningIcon />
              {timedOutMessage(ms(server.timeSincePing, { long: true }))}
            </WarningText>
          </CardContent>
        ) : null}

        {hasDescription(server) ? (
          <DescriptionDialog
            server={server}
            isOpen={isOpen}
            onCloseDescription={onCloseDescription}
          />
        ) : null}
      </Card>
    </div>
  );
}

ServerThumbnail.propTypes = {
  server: PropTypes.shape({
    name: PropTypes.string,
    subtitle: PropTypes.string,
    description: PropTypes.string,
    timeSincePing: PropTypes.number,
    url: PropTypes.string,
  }).isRequired,
  media: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default ServerThumbnail;
